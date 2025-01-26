import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../providers/theme-provider';
import { useEffect } from 'react';

// Mock component to test theme context
function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme-value">{theme}</div>
      <button onClick={toggleTheme} data-testid="theme-toggle">
        Toggle Theme
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset document.documentElement.classList
    document.documentElement.classList.remove('dark');
  });

  it('provides light theme by default when no system preference', () => {
    // Mock matchMedia to return no dark mode preference
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBeFalsy();
  });

  it('respects system dark mode preference', () => {
    // Mock matchMedia to return dark mode preference
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBeTruthy();
  });

  it('toggles theme correctly', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('theme-toggle');
    const initialTheme = screen.getByTestId('theme-value').textContent;

    act(() => {
      fireEvent.click(toggleButton);
    });

    expect(screen.getByTestId('theme-value').textContent).not.toBe(initialTheme);
    expect(document.documentElement.classList.contains('dark')).toBe(initialTheme === 'light');
  });

  it('persists theme preference in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('theme-toggle');

    act(() => {
      fireEvent.click(toggleButton);
    });

    expect(localStorage.getItem('theme')).toBe('dark');

    act(() => {
      fireEvent.click(toggleButton);
    });

    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('loads theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBeTruthy();
  });
}); 
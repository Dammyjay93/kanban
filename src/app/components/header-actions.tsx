'use client';

import { TbShare, TbMoon, TbSun } from "react-icons/tb";
import { useState } from 'react';

interface HeaderActionsProps {
  onShare: () => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export default function HeaderActions({ onShare, onThemeChange }: HeaderActionsProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setMousePosition({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center gap-1">
        <button
          onClick={handleThemeToggle}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePosition({ x: 50, y: 50 })}
          style={{
            '--mouse-x': `${mousePosition.x}%`,
            '--mouse-y': `${mousePosition.y}%`,
          } as React.CSSProperties}
          className={`flex items-center justify-center w-10 h-10 rounded-[12px] text-sm font-medium transition-all duration-200 relative text-gray-500 hover:text-gray-900 group ${[
            'hover:bg-[#F9F9FA]',
            'before:absolute before:inset-0 before:rounded-[12px] before:-z-10 before:opacity-0 group-hover:before:opacity-100',
            'before:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),_white_0%,_transparent_50%)]',
            'before:transition-[background-position,opacity] before:duration-300',
            'after:absolute after:inset-0 after:rounded-[12px] after:-z-20 after:opacity-0 group-hover:after:opacity-100',
            'after:shadow-[0_17px_5px_rgba(7,7,8,0.00),0_11px_4px_rgba(7,7,8,0.01),0_6px_4px_rgba(7,7,8,0.02),0_3px_3px_rgba(7,7,8,0.04),0_1px_1px_rgba(7,7,8,0.05)]',
            'hover:[box-shadow:inset_0_-2px_0_rgba(7,7,8,0.20)]',
            'hover:border hover:border-[#070708]/[0.06]',
            'transition-all duration-200'
          ].join(' ')}`}
        >
          {theme === 'light' ? <TbSun className="w-4 h-4" /> : <TbMoon className="w-4 h-4" />}
        </button>
        <button
          onClick={onShare}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePosition({ x: 50, y: 50 })}
          style={{
            '--mouse-x': `${mousePosition.x}%`,
            '--mouse-y': `${mousePosition.y}%`,
          } as React.CSSProperties}
          className={`flex items-center justify-center w-10 h-10 rounded-[12px] text-sm font-medium transition-all duration-200 relative text-gray-500 hover:text-gray-900 group before:absolute before:inset-0 before:rounded-[12px] before:-z-10 before:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),_white_0%,_transparent_70%)] before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-300 hover:bg-[#F9F9FA] hover:border hover:border-[#070708]/[0.06] hover:[box-shadow:inset_0_-2px_0_rgba(7,7,8,0.20)]`}
        >
          <TbShare className="w-4 h-4" />
        </button>
      </div>
      <div className="w-[1px] h-4 bg-gray-200 mr-3" />
      <button
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePosition({ x: 50, y: 50 })}
        style={{
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`,
        } as React.CSSProperties}
        className="avatar-trail flex items-center justify-center w-10 h-10 rounded-[12px] text-sm font-medium transition-colors relative bg-white outline outline-1 outline-gray-100 shadow-sm hover:text-gray-700"
      >
        <img 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
          alt="User avatar" 
          className="w-6 h-6 rounded-full z-[2]"
        />
      </button>
    </div>
  );
} 
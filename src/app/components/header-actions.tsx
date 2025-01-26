'use client';

import { TbShare, TbMoon, TbSun } from "react-icons/tb";
import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '../providers/theme-provider';

interface HeaderActionsProps {
  onShare: () => void;
}

export default function HeaderActions({ onShare }: HeaderActionsProps) {
  const { theme, toggleTheme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setMousePosition({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center gap-1">
        <button
          onClick={toggleTheme}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePosition({ x: 50, y: 50 })}
          style={{
            '--mouse-x': `${mousePosition.x}%`,
            '--mouse-y': `${mousePosition.y}%`,
          } as React.CSSProperties}
          className={`flex items-center justify-center w-10 h-10 rounded-[12px] text-sm font-medium transition-all duration-200 relative text-text-secondary hover:text-text-primary group ${[
            'hover:bg-surface-secondary',
            'before:absolute before:inset-0 before:rounded-[12px] before:-z-10',
            'before:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),_var(--surface-primary)_0%,_transparent_50%)]',
            'before:opacity-0 group-hover:before:opacity-100',
            'before:transition-all before:duration-200',
            'hover:shadow-[inset_0_-2px_0_var(--border-light),0_1px_3px_0_var(--border-light)] dark:hover:shadow-[inset_0_-2px_0_var(--border-light),0_2px_4px_rgba(255,255,255,0.05)]',
            'border border-transparent hover:border-border-light',
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
          className={`flex items-center justify-center w-10 h-10 rounded-[12px] text-sm font-medium transition-all duration-200 relative text-text-secondary hover:text-text-primary group ${[
            'hover:bg-surface-secondary',
            'before:absolute before:inset-0 before:rounded-[12px] before:-z-10',
            'before:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),_var(--surface-primary)_0%,_transparent_50%)]',
            'before:opacity-0 group-hover:before:opacity-100',
            'before:transition-all before:duration-200',
            'hover:shadow-[inset_0_-2px_0_var(--border-light),0_1px_3px_0_var(--border-light)] dark:hover:shadow-[inset_0_-2px_0_var(--border-light),0_2px_4px_rgba(255,255,255,0.05)]',
            'border border-transparent hover:border-border-light',
            'transition-all duration-200'
          ].join(' ')}`}
        >
          <TbShare className="w-4 h-4" />
        </button>
      </div>
      <div className="w-[1px] mr-3 h-4 bg-gray-200 dark:bg-gray-700" />
      <div className="relative">
        <button
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePosition({ x: 50, y: 50 })}
          style={{
            '--mouse-x': `${mousePosition.x}%`,
            '--mouse-y': `${mousePosition.y}%`,
          } as React.CSSProperties}
          className="avatar-trail flex items-center justify-center w-10 h-10 rounded-[12px] text-sm font-medium transition-colors duration-100 relative bg-surface-primary outline outline-1 outline-border-subtle shadow-sm hover:text-text-primary"
        >
          <Image 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User avatar" 
            width={24}
            height={24}
            className="rounded-full z-[2]"
          />
        </button>
        <div 
          className="absolute -top-5 -right-12 px-2 py-1 text-xs font-medium text-white bg-[#3B82F6] rounded-full opacity-0 transition-opacity duration-200 pointer-events-none z-[3] flex items-center gap-1.5 whitespace-nowrap shadow-[0_1px_2px_rgba(59,130,246,0.12),0_2px_2px_rgba(59,130,246,0.08),0_0_15px_rgba(59,130,246,0.4),inset_0_-0.5px_0_0_rgba(0,0,0,0.08),inset_0_0.5px_0_0_rgba(255,255,255,0.5)]" 
          style={{ 
            background: 'linear-gradient(to bottom, #4F94FF 0%, #3B82F6 100%)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <span className="tracking-[-0.01em] relative top-[0.5px]">Coming Soon</span>
        </div>
      </div>
    </div>
  );
} 
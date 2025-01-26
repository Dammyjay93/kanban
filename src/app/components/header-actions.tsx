'use client';

import { TbShare, TbMoon, TbSun, TbDeviceDesktop } from "react-icons/tb";
import { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '../providers/theme-provider';
import { motion } from 'framer-motion';
import type { Theme } from '../providers/theme-provider';

interface HeaderActionsProps {
  onShare: () => void;
}

const baseThemeIcons: { id: Theme; icon: typeof TbSun }[] = [
  { id: 'system', icon: TbDeviceDesktop },
  { id: 'light', icon: TbSun },
  { id: 'dark', icon: TbMoon },
];

const tweenConfig = {
  type: 'tween',
  duration: 0.1,
  ease: [0.33, 1, 0.68, 1]  // Custom easing curve for smooth acceleration and deceleration
};

export default function HeaderActions({ onShare }: HeaderActionsProps) {
  const { theme, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleThemeSelect = (selectedTheme: Theme) => {
    if (selectedTheme === theme) return;
    toggleTheme();
  };

  // Reorder icons to put current theme last
  const themeIcons = [
    ...baseThemeIcons.filter(t => t.id !== theme),
    baseThemeIcons.find(t => t.id === theme)!
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center gap-1">
        <div 
          className="relative"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <motion.div
            animate={{
              width: isExpanded ? 'auto' : 40,
              backgroundColor: isExpanded ? 'var(--surface-primary)' : 'transparent',
              borderColor: isExpanded ? 'var(--border-subtle)' : 'transparent'
            }}
            transition={tweenConfig}
            className="flex items-center justify-end gap-1 border rounded-[16px] p-1 overflow-hidden"
          >
            {themeIcons.map(({ id, icon: Icon }) => {
              const isSelected = theme === id;
              const isLast = id === theme;
              return (
                <motion.button
                  key={id}
                  animate={{ 
                    opacity: isExpanded || isLast ? 1 : 0,
                    scale: isExpanded || isLast ? 1 : 1
                  }}
                  transition={tweenConfig}
                  onClick={() => handleThemeSelect(id)}
                  className={`flex items-center justify-center w-8 h-8 rounded-[10px] ${
                    isSelected && isExpanded
                      ? 'bg-surface-secondary text-text-primary border border-border-subtle'
                      : isSelected
                      ? 'text-text-primary'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              );
            })}
          </motion.div>
        </div>
        <button
          onClick={onShare}
          className="flex items-center justify-center w-10 h-10 text-text-tertiary hover:text-text-secondary"
        >
          <TbShare className="w-4 h-4" />
        </button>
      </div>
      <div className="w-[1px] mr-3 h-4 bg-gray-200 dark:bg-gray-700" />
      <div className="relative">
        <button
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
'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';

interface Option {
  id: string;
  label: string;
  mobileLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface PillSwitcherProps {
  options: Option[];
  activeId: string;
  onChange: (id: string) => void;
  fontWeight?: 'regular' | 'medium';
  fullWidth?: boolean;
}

export default function PillSwitcher({ options, activeId, onChange, fontWeight = 'regular', fullWidth = false }: PillSwitcherProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [activeStyles, setActiveStyles] = useState({ width: 0, left: 0 });
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  useLayoutEffect(() => {
    const activeButton = buttonsRef.current.get(activeId);
    if (activeButton) {
      const parentLeft = activeButton.parentElement?.getBoundingClientRect().left ?? 0;
      const rect = activeButton.getBoundingClientRect();
      setActiveStyles({
        width: rect.width,
        left: rect.left - parentLeft,
      });
    }
  }, [activeId]);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setMousePosition({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className={`${fullWidth ? 'flex w-full' : 'inline-flex w-fit'} rounded-[12px] bg-white outline outline-1 outline-gray-100 shadow-sm p-1.5 relative`}>
      <motion.div 
        layout
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        className="absolute rounded-[12px] bg-[#F9F9FA] border border-[#070708]/[0.06] shadow-[0_17px_5px_rgba(7,7,8,0.00),0_11px_4px_rgba(7,7,8,0.01),0_6px_4px_rgba(7,7,8,0.02),0_3px_3px_rgba(7,7,8,0.04),0_1px_1px_rgba(7,7,8,0.05)] [box-shadow:inset_0_-2px_0_rgba(7,7,8,0.20)]"
        style={{
          width: activeStyles.width,
          height: 'calc(100% - 8px)',
          left: activeStyles.left,
          top: '4px',
        }}
      />
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          ref={(el) => {
            if (el) buttonsRef.current.set(id, el);
            else buttonsRef.current.delete(id);
          }}
          onClick={() => onChange(id)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePosition({ x: 50, y: 50 })}
          style={
            activeId === id
              ? {
                  '--mouse-x': `${mousePosition.x}%`,
                  '--mouse-y': `${mousePosition.y}%`,
                } as React.CSSProperties
              : undefined
          }
          className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-[12px] text-sm ${fontWeight === 'medium' ? 'font-medium' : 'font-regular'} transition-colors ${fullWidth ? 'flex-1' : ''} ${
            activeId === id
              ? [
                  'relative',
                  'before:absolute before:inset-0 before:rounded-[12px] before:-z-10',
                  'before:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),_white_0%,_transparent_50%)]',
                  'before:transition-[background-position] before:duration-300',
                  'text-gray-900 z-10'
                ].join(' ')
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {Icon && <Icon className="w-4 h-4" />}
          {label && <span className="hidden sm:inline">{label}</span>}
        </button>
      ))}
    </div>
  );
} 
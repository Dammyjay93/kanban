'use client';

import { TbLayoutKanban, TbList, TbTimeline, TbCalendar } from "react-icons/tb";
import { useState } from 'react';

type ViewType = 'board' | 'list' | 'timeline' | 'calendar';

interface ViewSwitcherProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

interface ViewOption {
  id: ViewType;
  label: string;
  icon: any;
}

const viewOptions: ViewOption[] = [
  { id: 'board', label: 'Board', icon: TbLayoutKanban },
  { id: 'list', label: 'List', icon: TbList },
  { id: 'timeline', label: 'Timeline', icon: TbTimeline },
  { id: 'calendar', label: 'Calendar', icon: TbCalendar },
];

export default function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
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
    <div className="inline-flex rounded-[12px] bg-white outline outline-1 outline-gray-100 shadow-sm p-1">
      {viewOptions.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePosition({ x: 50, y: 50 })}
          style={
            activeView === id
              ? {
                  '--mouse-x': `${mousePosition.x}%`,
                  '--mouse-y': `${mousePosition.y}%`,
                } as React.CSSProperties
              : undefined
          }
          className={`flex items-center gap-2 px-4 py-2 rounded-[12px] text-sm font-medium transition-colors ${
            activeView === id
              ? [
                  'relative bg-[#F9F9FA]',
                  'before:absolute before:inset-0 before:rounded-[12px] before:-z-10',
                  'before:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),_white_0%,_transparent_50%)]',
                  'before:transition-[background-position] before:duration-300',
                  'after:absolute after:inset-0 after:rounded-[12px] after:-z-20',
                  'after:shadow-[0_17px_5px_rgba(7,7,8,0.00),0_11px_4px_rgba(7,7,8,0.01),0_6px_4px_rgba(7,7,8,0.02),0_3px_3px_rgba(7,7,8,0.04),0_1px_1px_rgba(7,7,8,0.05)]',
                  '[box-shadow:inset_0_-2px_0_rgba(7,7,8,0.20)]',
                  'border border-[#070708]/[0.06]',
                  'text-gray-900 z-10'
                ].join(' ')
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Icon weight="regular" className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
} 
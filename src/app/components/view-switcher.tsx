'use client';

import { SquaresFour, List } from '@phosphor-icons/react';

type ViewType = 'board' | 'list';

interface ViewSwitcherProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      <button
        onClick={() => onViewChange('board')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeView === 'board'
            ? 'bg-white shadow-sm text-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <SquaresFour weight="regular" className="w-4 h-4" />
        Board View
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeView === 'list'
            ? 'bg-white shadow-sm text-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <List weight="regular" className="w-4 h-4" />
        List View
      </button>
    </div>
  );
} 
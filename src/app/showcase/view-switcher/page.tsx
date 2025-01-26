'use client';

import { useState } from 'react';
import { TbLayoutKanban, TbList, TbTimeline, TbCalendar } from "react-icons/tb";
import PillSwitcher from '@/app/components/pill-switcher';

const options = [
  { id: 'board', label: 'Board', icon: TbLayoutKanban },
  { id: 'list', label: 'List', icon: TbList },
  { id: 'timeline', label: 'Timeline', icon: TbTimeline },
  { id: 'calendar', label: 'Calendar', icon: TbCalendar },
];

export default function ViewSwitcherShowcase() {
  const [activeId, setActiveId] = useState('board');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F3F4F5]">
      <PillSwitcher
        options={options}
        activeId={activeId}
        onChange={setActiveId}
        fontWeight="regular"
      />
    </div>
  );
} 
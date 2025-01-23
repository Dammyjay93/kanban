'use client';

import { TbLayoutKanban, TbList, TbTimeline, TbCalendar } from "react-icons/tb";
import PillSwitcher from './pill-switcher';

type ViewType = 'board' | 'list' | 'timeline' | 'calendar';

interface ViewSwitcherProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const viewOptions = [
  { id: 'board', label: 'Board', icon: TbLayoutKanban, mobileLabel: '' },
  { id: 'list', label: 'List', icon: TbList, mobileLabel: '' },
  { id: 'timeline', label: 'Timeline', icon: TbTimeline, mobileLabel: '' },
  { id: 'calendar', label: 'Calendar', icon: TbCalendar, mobileLabel: '' },
];

export default function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  
  const options = viewOptions.map(option => ({
    ...option,
    label: isMobile ? option.mobileLabel : option.label
  }));

  return (
    <PillSwitcher
      options={options}
      activeId={activeView}
      onChange={(id) => onViewChange(id as ViewType)}
      fontWeight="regular"
    />
  );
} 
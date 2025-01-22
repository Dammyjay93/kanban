'use client';

import { TbLayoutKanban, TbList, TbTimeline, TbCalendar } from "react-icons/tb";
import PillSwitcher from './pill-switcher';

type ViewType = 'board' | 'list' | 'timeline' | 'calendar';

interface ViewSwitcherProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const viewOptions = [
  { id: 'board', label: 'Board', icon: TbLayoutKanban },
  { id: 'list', label: 'List', icon: TbList },
  { id: 'timeline', label: 'Timeline', icon: TbTimeline },
  { id: 'calendar', label: 'Calendar', icon: TbCalendar },
];

export default function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  return (
    <PillSwitcher
      options={viewOptions}
      activeId={activeView}
      onChange={(id) => onViewChange(id as ViewType)}
      fontWeight="regular"
    />
  );
} 
'use client';

import { TbDots, TbFlag3, TbCalendarClock, TbCircleDashed, TbSubtask } from "react-icons/tb";
import { useState } from 'react';
import Image from 'next/image';

interface KanbanCardProps {
  id: string;
  index: number;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  assignees: {
    id: string;
    avatar: string;
  }[];
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  onClick: () => void;
  onDelete: (id: string) => void;
}

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case 'Low':
      return 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400';
    case 'Medium':
      return 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400';
    case 'High':
      return 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400';
    default:
      return 'bg-surface-secondary text-text-primary';
  }
};

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return `In ${diffDays} days`;
  return new Date(dateString).toLocaleDateString();
};

export default function KanbanCard({
  id,
  index,
  title,
  description,
  priority,
  dueDate,
  assignees,
  subtasks = [],
  onClick,
  onDelete
}: KanbanCardProps) {
  const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  const progress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      setMousePosition({
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      });
    }
  };

  return (
    <div
      draggable
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setMousePosition({ x: 50, y: 50 });
        setShowMenu(false);
      }}
      onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.dataTransfer.setData('taskId', id);
        e.dataTransfer.setData('sourceIndex', index.toString());
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.style.opacity = '0.5';
        }
      }}
      onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(false);
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.style.opacity = '1';
        }
      }}
      style={{
        '--mouse-x': isDragging ? '50%' : `${mousePosition.x}%`,
        '--mouse-y': isDragging ? '50%' : `${mousePosition.y}%`,
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none'
      } as React.CSSProperties}
      className={`relative bg-[var(--card-bg)] p-3 rounded-[12px] cursor-grab transition-all duration-200
        border border-[var(--card-border)]
        shadow-[var(--card-shadow)]
        
        [@media(hover:hover)]:hover:bg-[var(--card-hover-bg)]
        [@media(hover:hover)]:hover:border-[var(--card-hover-border)]
        [@media(hover:hover)]:hover:shadow-none
        
        active:cursor-grabbing
        select-none
        [user-select:none]
        [-webkit-user-select:none]
        [-webkit-touch-callout:none]`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium select-none ${getPriorityStyle(priority)}`}>
          <TbFlag3 className="w-3 h-3" />
          {priority}
        </span>
        <div className="relative ml-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-text-tertiary hover:text-text-secondary"
          >
            <TbDots className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-surface-primary rounded-lg shadow-lg border border-border-subtle py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-left text-text-secondary hover:bg-surface-secondary select-none"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-surface-secondary select-none"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-sm font-medium text-text-primary mb-1 select-none">{title}</h3>
      <p className="text-sm text-text-secondary mb-3 line-clamp-2 select-none">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {assignees.map((assignee, index) => (
            <Image
              key={assignee.id}
              src={assignee.avatar}
              alt={`Assignee ${index + 1}`}
              width={24}
              height={24}
              className="rounded-full border-2 border-surface-primary"
            />
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-text-tertiary">
          {dueDate && (
            <div className="flex items-center gap-1">
              <TbCalendarClock className="w-3.5 h-3.5" />
              <span className="select-none">{getRelativeTime(dueDate)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <TbSubtask className="w-3.5 h-3.5" />
            <span className="select-none">{completedSubtasks}/{subtasks.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <TbCircleDashed className="w-3.5 h-3.5" />
            <span className="select-none">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
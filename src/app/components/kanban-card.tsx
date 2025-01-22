'use client';

import { TbDots, TbFlag, TbMessage2, TbCalendarClock, TbCircleDashed, TbSubtask, TbFlag3 } from "react-icons/tb";
import { useState } from 'react';

interface KanbanCardProps {
  id: string;
  index: number;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  comments?: number;
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
      return 'bg-blue-50 text-blue-700';
    case 'Medium':
      return 'bg-yellow-50 text-yellow-700';
    case 'High':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-50 text-gray-700';
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
  comments = 0,
  assignees,
  subtasks = [],
  onClick,
  onDelete
}: KanbanCardProps) {
  const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  const progress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [showMenu, setShowMenu] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    setMousePosition({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
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
        e.dataTransfer.setData('taskId', id);
        e.dataTransfer.setData('sourceIndex', index.toString());
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.style.opacity = '0.5';
        }
      }}
      onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.style.opacity = '1';
        }
      }}
      style={{
        '--mouse-x': `${mousePosition.x}%`,
        '--mouse-y': `${mousePosition.y}%`,
      } as React.CSSProperties}
      className="relative bg-white p-3 rounded-[12px] cursor-pointer transition-all duration-200
        border border-[#070708]/[0.06]
        before:absolute before:inset-0 before:rounded-[12px] before:-z-10
        before:bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),_white_0%,_transparent_50%)]
        before:transition-[background-position] before:duration-300
        after:absolute after:inset-0 after:rounded-[12px] after:-z-20
        after:shadow-[0_17px_5px_rgba(7,7,8,0.00),0_11px_4px_rgba(7,7,8,0.01),0_6px_4px_rgba(7,7,8,0.02),0_3px_3px_rgba(7,7,8,0.04),0_1px_1px_rgba(7,7,8,0.05)]
        [box-shadow:inset_0_-2px_0_rgba(7,7,8,0.08)]
        hover:bg-[#F9F9FA]
        active:translate-y-[0.5px]"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityStyle(priority)}`}>
          <TbFlag3 className="w-3 h-3" />
          {priority}
        </span>
        <div className="relative ml-auto">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <TbDots className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit action
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {assignees.map((assignee, index) => (
            <img
              key={assignee.id}
              src={assignee.avatar}
              alt={`Assignee ${index + 1}`}
              className="w-6 h-6 rounded-full border-2 border-white"
            />
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          {dueDate && (
            <div className="flex items-center gap-1">
              <TbCalendarClock className="w-3.5 h-3.5" />
              <span>{getRelativeTime(dueDate)}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <TbSubtask className="w-3.5 h-3.5" />
            <span>{completedSubtasks}/{subtasks.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <TbCircleDashed className="w-3.5 h-3.5" />
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="flex items-center gap-1">
            <TbMessage2 className="w-3.5 h-3.5" />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
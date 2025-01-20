'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { DotsThree, Trash, Flag, CheckSquare, Clock, Share } from '@phosphor-icons/react';

interface KanbanCardProps {
  title: string;
  description: string;
  id: string;
  index: number;
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

export default function KanbanCard({ 
  title, 
  description, 
  id, 
  index, 
  status, 
  priority,
  dueDate,
  assignees,
  subtasks = [],
  onClick, 
  onDelete 
}: KanbanCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
    setIsMenuOpen(false);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const taskUrl = `${window.location.origin}/task/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url: taskUrl
        });
      } else {
        await navigator.clipboard.writeText(taskUrl);
        // You might want to add a toast notification here
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
    setIsMenuOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-blue-50 text-blue-700';
      case 'Medium':
        return 'bg-yellow-50 text-yellow-700';
      case 'High':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const dueDate = new Date(date);
    const diffTime = Math.abs(dueDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}d`;
  };

  const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = subtasks.length;

  return (
    <motion.div
      layout
      layoutId={id}
      transition={{ duration: 0.15 }}
      className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:scale-[1.01] transition-transform"
      draggable="true"
      onClick={onClick}
      onDragStart={(e: any) => {
        if (e.dataTransfer) {
          e.dataTransfer.setData('taskId', id);
          e.dataTransfer.setData('sourceIndex', index.toString());
          if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '0.1';
          }
        }
      }}
      onDragEnd={(e: any) => {
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.style.opacity = '1';
        }
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
          <Flag className="w-3 h-3" weight="regular" />
          {priority}
        </span>
        <div className="relative ml-auto" ref={menuRef}>
          <button 
            onClick={handleMenuClick}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50"
          >
            <DotsThree weight="bold" className="w-5 h-5" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={handleShare}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
              >
                <Share className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
      
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

        <div className="flex items-center gap-3 text-sm text-gray-500">
          {dueDate && typeof dueDate === 'string' && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{getRelativeTime(dueDate)}</span>
            </div>
          )}
          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1">
              <CheckSquare className="w-4 h-4" />
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 
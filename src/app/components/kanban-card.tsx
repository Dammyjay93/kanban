'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { DotsThree, Trash, Flag } from '@phosphor-icons/react';

interface KanbanCardProps {
  title: string;
  description: string;
  id: string;
  index: number;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'Low' | 'Medium' | 'High';
  onClick: () => void;
  onDelete: (id: string) => void;
}

export default function KanbanCard({ title, description, id, index, status, priority, onClick, onDelete }: KanbanCardProps) {
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
          <img
            src="https://ui-avatars.com/api/?name=John+Doe&background=random"
            alt="Assignee"
            className="w-6 h-6 rounded-full border-2 border-white"
          />
          <img
            src="https://ui-avatars.com/api/?name=Jane+Smith&background=random"
            alt="Assignee"
            className="w-6 h-6 rounded-full border-2 border-white"
          />
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
            </svg>
            <span>12</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>1</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>0/3</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 
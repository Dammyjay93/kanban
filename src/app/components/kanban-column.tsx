'use client';

import { motion } from 'framer-motion';
import { DotsThree, Plus } from '@phosphor-icons/react';
import KanbanCard from './kanban-card';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'Low' | 'Medium' | 'High';
}

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: 'todo' | 'inProgress' | 'done';
  onDrop: (taskId: string) => void;
  onReorder: (taskId: string, sourceIndex: number, targetIndex: number) => void;
  onAddCard: (status: 'todo' | 'inProgress' | 'done') => void;
  onTaskClick: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        indicator: 'bg-blue-500'
      };
    case 'inProgress':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        indicator: 'bg-yellow-500'
      };
    case 'done':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        indicator: 'bg-green-500'
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        indicator: 'bg-gray-500'
      };
  }
};

export default function KanbanColumn({ title, tasks, status, onDrop, onReorder, onAddCard, onTaskClick, onDeleteTask }: KanbanColumnProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const colors = getStatusColor(status);

  return (
    <div
      className="w-80 transition-colors duration-150"
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
        setDragOverIndex(null);
        setIsDraggingOver(false);
      }}
      onDrop={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));
        
        if (taskId) {
          if (dragOverIndex !== null && tasks.find(t => t.id === taskId)) {
            onReorder(taskId, sourceIndex, dragOverIndex);
          } else {
            onDrop(taskId);
          }
        }
        setDragOverIndex(null);
        setIsDraggingOver(false);
      }}
    >
      <div className="flex items-center gap-2 mb-4 relative pl-3">
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 ${colors.indicator} rounded-full`} />
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className={`flex items-center justify-center px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} text-sm font-medium`}>
          {tasks.length}
        </div>
        <button className="ml-auto text-gray-400 hover:text-gray-600">
          <DotsThree weight="bold" className="w-6 h-6" />
        </button>
      </div>
      <motion.div layout transition={{ duration: 0.15 }} className="space-y-3">
        {tasks.map((task, index) => (
          <div key={task.id} className="relative">
            {isDraggingOver && dragOverIndex === index && (
              <div className={`absolute -top-2 left-0 right-0 h-0.5 ${colors.indicator} rounded-full`} />
            )}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIndex(index);
              }}
            >
              <KanbanCard
                id={task.id}
                index={index}
                title={task.title}
                description={task.description}
                status={task.status}
                priority={task.priority}
                onClick={() => onTaskClick(task.id)}
                onDelete={onDeleteTask}
              />
            </div>
            {isDraggingOver && dragOverIndex === tasks.length - 1 && index === tasks.length - 1 && (
              <div className={`absolute -bottom-2 left-0 right-0 h-0.5 ${colors.indicator} rounded-full`} />
            )}
          </div>
        ))}
        {tasks.length === 0 && isDraggingOver && (
          <div className="h-24 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center">
            <p className="text-gray-400">Drop here</p>
          </div>
        )}
        <button
          onClick={() => onAddCard(status)}
          className="w-full py-2 px-3 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150"
        >
          <Plus className="w-4 h-4" />
          <span>Add new</span>
        </button>
      </motion.div>
    </div>
  );
} 
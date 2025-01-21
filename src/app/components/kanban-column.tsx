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
      className="kanban-column w-80 min-h-[calc(100vh-200px)] transition-colors duration-150 p-1 rounded-xl"
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
      <div className="column-container h-full flex flex-col space-y-4 bg-gray-50 rounded-lg p-4">
        <div className="column-header flex items-center gap-2 relative pl-3">
          <div className={`column-indicator absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 ${colors.indicator} rounded-full`} />
          <h2 className="column-title text-sm font-medium text-gray-900">{title}</h2>
          <div className={`column-count flex items-center justify-center px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} text-xs font-medium`}>
            {tasks.length}
          </div>
          <button className="column-menu ml-auto text-gray-400 hover:text-gray-600">
            <DotsThree weight="bold" className="w-5 h-5" />
          </button>
        </div>
        <div className="column-content flex-1">
          <motion.div layout transition={{ duration: 0.15 }} className="tasks-container space-y-3">
            {tasks.map((task, index) => (
              <div key={task.id} className="task-wrapper relative">
                {isDraggingOver && dragOverIndex === index && (
                  <div className={`drag-indicator absolute -top-2 left-0 right-0 h-0.5 ${colors.indicator} rounded-full`} />
                )}
                <div
                  className="task-drop-zone"
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
                    dueDate={task.dueDate}
                    assignees={task.assignees}
                    subtasks={task.subtasks}
                    onClick={() => onTaskClick(task.id)}
                    onDelete={onDeleteTask}
                  />
                </div>
                {isDraggingOver && dragOverIndex === tasks.length - 1 && index === tasks.length - 1 && (
                  <div className={`drag-indicator absolute -bottom-2 left-0 right-0 h-0.5 ${colors.indicator} rounded-full`} />
                )}
              </div>
            ))}
            {tasks.length === 0 && isDraggingOver && (
              <div className="empty-drop-zone h-24 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-400">Drop here</p>
              </div>
            )}
            <button
              onClick={() => onAddCard(status)}
              className="add-task-button w-full py-2 px-3 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150"
            >
              <Plus className="w-4 h-4" />
              <span>Add new</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
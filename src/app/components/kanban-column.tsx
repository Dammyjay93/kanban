'use client';

import { motion } from 'framer-motion';
import { DotsThree, Plus } from '@phosphor-icons/react';
import KanbanCard from './kanban-card';

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

const getColumnStyle = (status: string) => {
  switch (status) {
    case 'todo':
      return {
        indicator: 'bg-blue-500',
        count: 'bg-blue-50 text-blue-700'
      };
    case 'inProgress':
      return {
        indicator: 'bg-yellow-500',
        count: 'bg-yellow-50 text-yellow-700'
      };
    case 'done':
      return {
        indicator: 'bg-green-500',
        count: 'bg-green-50 text-green-700'
      };
    default:
      return {
        indicator: 'bg-gray-500',
        count: 'bg-gray-50 text-gray-700'
      };
  }
};

export default function KanbanColumn({ 
  title, 
  tasks, 
  status, 
  onDrop, 
  onReorder, 
  onAddCard, 
  onTaskClick, 
  onDeleteTask 
}: KanbanColumnProps) {
  const styles = getColumnStyle(status);

  return (
    <div
      className="w-80 h-full bg-[#F1F1F1] border border-1.5 border-[#EBEBEB] rounded-lg shadow-sm flex flex-col"
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));
        
        if (taskId) {
          if (tasks.find(t => t.id === taskId)) {
            onReorder(taskId, sourceIndex, tasks.length);
          } else {
            onDrop(taskId);
          }
        }
      }}
    >
      <div className="shrink-0 px-3 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <div className={`w-1 h-5 ${styles.indicator} rounded-full`} />
          <h2 className="text-base font-medium text-gray-900">{title}</h2>
          <div className={`px-2 py-0.5 rounded-full ${styles.count} text-xs font-medium`}>
            {tasks.length}
          </div>
          <button className="ml-auto text-gray-400 hover:text-gray-600">
            <DotsThree weight="bold" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1 pt-2 pb-1">
        <motion.div layout className="space-y-1">
          {tasks.map((task, index) => (
            <KanbanCard
              key={task.id}
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
          ))}
          <button
            onClick={() => onAddCard(status)}
            className="w-full py-2 px-3 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-white rounded-[12px] transition-colors duration-150"
          >
            <Plus className="w-4 h-4" />
            <span>Add task</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
} 
'use client';

import { motion } from 'framer-motion';
import { DotsThree, Plus } from '@phosphor-icons/react';
import { useState } from 'react';
import KanbanCard from './kanban-card';
import { kanbanAnimations } from '../constants/animations';

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
  onDrop: (taskId: string, targetIndex: number) => void;
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
        count: 'bg-blue-50 text-blue-700',
        border: 'border-blue-500'
      };
    case 'inProgress':
      return {
        indicator: 'bg-yellow-500',
        count: 'bg-yellow-50 text-yellow-700',
        border: 'border-yellow-500'
      };
    case 'done':
      return {
        indicator: 'bg-green-500',
        count: 'bg-green-50 text-green-700',
        border: 'border-green-500'
      };
    default:
      return {
        indicator: 'bg-gray-500',
        count: 'bg-gray-50 text-gray-700',
        border: 'border-gray-500'
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropPosition, setDropPosition] = useState<number | null>(null);
  const [draggedTask, setDraggedTask] = useState<{ id: string, sourceColumn: string } | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);

    // Calculate drop position
    const column = e.currentTarget;
    const cards = Array.from(column.getElementsByClassName('kanban-card'));
    const mouseY = e.clientY;

    let position = tasks.length;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const rect = card.getBoundingClientRect();
      const cardMiddle = rect.top + rect.height / 2;

      if (mouseY < cardMiddle) {
        position = i;
        break;
      }
    }
    setDropPosition(position);
  };

  return (
    <div
      className={`w-full bg-[#F1F1F1] rounded-[16px] shadow-sm flex flex-col h-fit ${
        isDragOver ? `border ${styles.border}` : 'border border-[#EBEBEB]'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={() => {
        setIsDragOver(false);
        setDropPosition(null);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        setDropPosition(null);
        setDraggedTask(null);
        const taskId = e.dataTransfer.getData('taskId');
        const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));
        const targetIndex = dropPosition ?? tasks.length;
        
        if (taskId) {
          if (tasks.find(t => t.id === taskId)) {
            onReorder(taskId, sourceIndex, targetIndex);
          } else {
            onDrop(taskId, targetIndex);
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

      <div className="px-1 pt-2 pb-1">
        <motion.div 
          {...kanbanAnimations.layout}
          className="space-y-1 pr-2 -mr-2"
          style={{
            willChange: isDragOver ? 'transform' : 'auto'
          }}
        >
          {tasks.map((task, index) => {
            const isDragging = draggedTask?.id === task.id && draggedTask.sourceColumn === status;
            
            return (
              <motion.div 
                key={task.id} 
                className="relative"
                {...(isDragging ? {} : kanbanAnimations.card)}
                animate={isDragging ? 'dragging' : 'default'}
              >
                {dropPosition === index && (
                  <div 
                    className={`absolute -top-1 left-0 right-0 h-0.5 ${styles.indicator} rounded-full`} 
                  />
                )}
                <div 
                  className={`kanban-card w-full transition-all duration-200 ${
                    isDragging ? 'opacity-40 !bg-gray-50 !border !border-dashed !rounded-[12px] !border-gray-500 relative after:absolute after:inset-0 after:bg-[#DEDEDE] after:rounded-[12px] after:pointer-events-none' : ''
                  }`}
                  style={{
                    willChange: isDragOver ? 'transform' : 'auto'
                  }}
                  draggable
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                    e.dataTransfer.setData('taskId', task.id);
                    e.dataTransfer.setData('sourceIndex', index.toString());
                    setDraggedTask({ id: task.id, sourceColumn: status });
                  }}
                  onDragEnd={() => setDraggedTask(null)}
                >
                  <style jsx>{`
                    @media (hover: none) and (pointer: coarse) {
                      .kanban-card:hover {
                        transform: none !important;
                        box-shadow: none !important;
                      }
                    }
                  `}</style>
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
              </motion.div>
            );
          })}
          {dropPosition === tasks.length && (
            <div className={`h-0.5 ${styles.indicator} rounded-full`} />
          )}
          <button
            onClick={() => onAddCard(status)}
            className="w-full py-2 px-3 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-transparent hover:bg-white rounded-[12px] transition-all duration-480"
          >
            <Plus className="w-4 h-4" />
            <span>Add task</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
} 
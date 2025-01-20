'use client';

import { useEffect, useState } from 'react';
import TaskDrawer from '@/app/components/task-drawer';
import { useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  createdAt: string;
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
  activities?: {
    id: string;
    type: 'status_change' | 'priority_change' | 'assignee_change' | 'comment_added';
    message: string;
    timestamp: string;
    userId: string;
    userName: string;
    details?: {
      oldStatus?: Task['status'];
      newStatus?: Task['status'];
      comment?: string;
    };
  }[];
}

export default function TaskPage({ params }: { params: { id: string } }) {
  const [task, setTask] = useState<Task | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        const foundTask = tasks.find((t: Task) => t.id === params.id);
        if (foundTask) {
          setTask(foundTask);
        }
      } catch (error) {
        console.error('Error loading task:', error);
      }
    }
  }, [params.id]);

  const handleTaskUpdate = (updatedTask: Task) => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        const updatedTasks = tasks.map((t: Task) => 
          t.id === updatedTask.id ? updatedTask : t
        );
        localStorage.setItem('kanban-tasks', JSON.stringify(updatedTasks));
        setTask(updatedTask);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskDrawer
        task={task}
        onClose={() => router.push('/')}
        onUpdate={handleTaskUpdate}
      />
    </div>
  );
} 
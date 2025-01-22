'use client';

import { useEffect, useState } from 'react';
import TaskDrawer from '@/app/components/task-drawer';
import { useRouter, useParams } from 'next/navigation';
import { Task } from '@/app/types';

export default function TaskPage() {
  const [task, setTask] = useState<Task | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        const foundTask = tasks.find((t: Task) => t.id === id);
        if (foundTask) {
          setTask(foundTask);
        }
      } catch (error) {
        console.error('Error loading task:', error);
      }
    }
  }, [id]);

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
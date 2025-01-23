'use client';

import { useState, useEffect } from 'react';
import KanbanColumn from './kanban-column';
import TaskDrawer from './task-drawer';
import { Task } from '../types';

const STORAGE_KEY = 'kanban-tasks';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Create login page',
    description: 'Design and implement user authentication',
    status: 'todo',
    createdAt: new Date().toLocaleString(),
    priority: 'Low',
    assignees: [
      { id: '1', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff' },
    ],
    subtasks: [
      { id: '1-1', title: 'Design login form UI', completed: true },
      { id: '1-2', title: 'Implement form validation', completed: false },
    ],
    activities: [],
    comments: []
  }
];

export default function BoardView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks:', error);
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const moveTask = (taskId: string, newStatus: 'todo' | 'inProgress' | 'done', targetIndex?: number) => {
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      const taskIndex = newTasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevTasks;

      const task = { ...newTasks[taskIndex], status: newStatus };
      newTasks.splice(taskIndex, 1);

      // If targetIndex is provided, insert at that position
      if (targetIndex !== undefined) {
        const statusTasks = newTasks.filter(t => t.status === newStatus);
        const nonStatusTasks = newTasks.filter(t => t.status !== newStatus);
        statusTasks.splice(targetIndex, 0, task);
        return [...nonStatusTasks, ...statusTasks];
      }

      // Otherwise, add to the end
      return [...newTasks, task];
    });
  };

  const reorderTask = (taskId: string, sourceIndex: number, targetIndex: number) => {
    const newTasks = [...tasks];
    const task = newTasks.find(t => t.id === taskId);
    if (!task) return;

    const statusTasks = newTasks.filter(t => t.status === task.status);
    const reorderedStatusTasks = [...statusTasks];
    
    reorderedStatusTasks.splice(sourceIndex, 1);
    reorderedStatusTasks.splice(targetIndex, 0, task);
    
    setTasks([
      ...tasks.filter(t => t.status !== task.status),
      ...reorderedStatusTasks
    ]);
  };

  const addCard = (status: 'todo' | 'inProgress' | 'done') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      description: 'Click to edit description',
      status,
      createdAt: new Date().toLocaleString(),
      priority: 'Low',
      assignees: [],
      subtasks: [],
      activities: [],
      comments: []
    };
    setTasks([...tasks, newTask]);
  };

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setSelectedTask(updatedTask);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-6 -mx-6 px-6 md:mx-0 md:px-0">
      <div className="flex gap-6 min-w-max md:min-w-0 md:w-full">
        <div className="w-[75vw] md:flex-1">
          <KanbanColumn
            title="To Do"
            status="todo"
            tasks={tasks.filter(task => task.status === 'todo')}
            onDrop={(taskId, targetIndex) => moveTask(taskId, 'todo', targetIndex)}
            onReorder={reorderTask}
            onAddCard={addCard}
            onTaskClick={handleTaskClick}
            onDeleteTask={deleteTask}
          />
        </div>
        <div className="w-[75vw] md:flex-1">
          <KanbanColumn
            title="In Progress"
            status="inProgress"
            tasks={tasks.filter(task => task.status === 'inProgress')}
            onDrop={(taskId, targetIndex) => moveTask(taskId, 'inProgress', targetIndex)}
            onReorder={reorderTask}
            onAddCard={addCard}
            onTaskClick={handleTaskClick}
            onDeleteTask={deleteTask}
          />
        </div>
        <div className="w-[75vw] md:flex-1">
          <KanbanColumn
            title="Done"
            status="done"
            tasks={tasks.filter(task => task.status === 'done')}
            onDrop={(taskId, targetIndex) => moveTask(taskId, 'done', targetIndex)}
            onReorder={reorderTask}
            onAddCard={addCard}
            onTaskClick={handleTaskClick}
            onDeleteTask={deleteTask}
          />
        </div>
      </div>

      <TaskDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleTaskUpdate}
      />
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import KanbanColumn from './kanban-column';
import TaskDrawer from './task-drawer';

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
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Create login page',
    description: 'Design and implement user authentication',
    status: 'todo',
    createdAt: 'September 20, 2024 10:35 AM',
    priority: 'Low',
    dueDate: '2022-10-12',
    assignees: [
      { id: '1', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff' },
      { id: '2', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=22c55e&color=fff' },
      { id: '3', avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=ef4444&color=fff' }
    ],
    subtasks: [
      { id: '1-1', title: 'Design login form UI', completed: true },
      { id: '1-2', title: 'Implement form validation', completed: false },
      { id: '1-3', title: 'Add social login options', completed: false },
    ]
  },
  {
    id: '2',
    title: 'Setup database',
    description: 'Configure PostgreSQL for the project',
    status: 'todo',
    createdAt: 'September 19, 2024 2:15 PM',
    priority: 'Medium',
    assignees: [
      { id: '2', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=22c55e&color=fff' }
    ],
    subtasks: [
      { id: '2-1', title: 'Install PostgreSQL', completed: true },
      { id: '2-2', title: 'Create initial schema', completed: false },
    ]
  },
  {
    id: '3',
    title: 'Build API endpoints',
    description: 'Create REST API for user management',
    status: 'inProgress',
    createdAt: 'September 18, 2024 11:20 AM',
    priority: 'High',
    dueDate: '2022-10-10',
    assignees: [
      { id: '1', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff' },
      { id: '3', avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=ef4444&color=fff' }
    ],
    subtasks: [
      { id: '3-1', title: 'Define API routes', completed: true },
      { id: '3-2', title: 'Implement CRUD operations', completed: true },
      { id: '3-3', title: 'Add authentication middleware', completed: false },
      { id: '3-4', title: 'Write API documentation', completed: false },
    ]
  },
  {
    id: '4',
    title: 'Project setup',
    description: 'Initialize Next.js with TypeScript',
    status: 'done',
    createdAt: 'September 15, 2024 9:00 AM',
    priority: 'Low',
    assignees: [
      { id: '1', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff' }
    ],
    subtasks: [
      { id: '4-1', title: 'Create Next.js project', completed: true },
      { id: '4-2', title: 'Add TypeScript configuration', completed: true },
      { id: '4-3', title: 'Setup ESLint and Prettier', completed: true },
    ]
  },
  {
    id: '5',
    title: 'Add Tailwind CSS',
    description: 'Configure styling framework',
    status: 'done',
    createdAt: 'September 16, 2024 3:45 PM',
    priority: 'Low',
    assignees: [
      { id: '2', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=22c55e&color=fff' }
    ],
    subtasks: [
      { id: '5-1', title: 'Install Tailwind CSS', completed: true },
      { id: '5-2', title: 'Configure PostCSS', completed: true },
      { id: '5-3', title: 'Create base styles', completed: true },
    ]
  },
];

const STORAGE_KEY = 'kanban-tasks';

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        // Ensure each task has a subtasks array
        const validatedTasks = parsed.map((task: Task) => ({
          ...task,
          subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
        }));
        setTasks(validatedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
        setTasks(initialTasks);
      }
    } else {
      setTasks(initialTasks);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const moveTask = (taskId: string, newStatus: 'todo' | 'inProgress' | 'done') => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const reorderTask = (taskId: string, sourceIndex: number, targetIndex: number) => {
    const newTasks = [...tasks];
    const task = newTasks.find(t => t.id === taskId);
    if (!task) return;

    const statusTasks = newTasks.filter(t => t.status === task.status);
    const reorderedStatusTasks = [...statusTasks];
    
    // Remove from source and insert at target
    reorderedStatusTasks.splice(sourceIndex, 1);
    reorderedStatusTasks.splice(targetIndex, 0, task);
    
    // Update the main tasks array while preserving other statuses
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
      createdAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }),
      priority: 'Low',
      assignees: [],
      subtasks: [],
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
    // Ensure subtasks is always an array
    const validatedTask = {
      ...updatedTask,
      subtasks: Array.isArray(updatedTask.subtasks) ? updatedTask.subtasks : []
    };
    setTasks(tasks.map(task => 
      task.id === validatedTask.id ? validatedTask : task
    ));
    setSelectedTask(validatedTask);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <>
      <div className="flex gap-8">
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={tasks.filter(task => task.status === 'todo')}
          onDrop={(taskId) => moveTask(taskId, 'todo')}
          onReorder={reorderTask}
          onAddCard={addCard}
          onTaskClick={handleTaskClick}
          onDeleteTask={deleteTask}
        />
        <KanbanColumn
          title="In Progress"
          status="inProgress"
          tasks={tasks.filter(task => task.status === 'inProgress')}
          onDrop={(taskId) => moveTask(taskId, 'inProgress')}
          onReorder={reorderTask}
          onAddCard={addCard}
          onTaskClick={handleTaskClick}
          onDeleteTask={deleteTask}
        />
        <KanbanColumn
          title="Done"
          status="done"
          tasks={tasks.filter(task => task.status === 'done')}
          onDrop={(taskId) => moveTask(taskId, 'done')}
          onReorder={reorderTask}
          onAddCard={addCard}
          onTaskClick={handleTaskClick}
          onDeleteTask={deleteTask}
        />
      </div>

      <TaskDrawer
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={handleTaskUpdate}
      />
    </>
  );
} 
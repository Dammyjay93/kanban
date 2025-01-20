'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  X, 
  DotsThree, 
  Clock, 
  Tag, 
  TextAlignLeft, 
  User, 
  CaretLeft,
  PaperclipHorizontal,
  DownloadSimple,
  FilePdf,
  File,
  CheckSquare,
  ListChecks,
  ChatCircle,
  Activity
} from '@phosphor-icons/react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  subtasks?: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

type TabType = 'subtasks' | 'comments' | 'activities';

interface TaskDrawerProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

export default function TaskDrawer({ task, onClose, onUpdate }: TaskDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('subtasks');
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [task]);

  if (!task) return null;

  const handleTitleSubmit = () => {
    onUpdate({ ...task, title });
  };

  const handleDescriptionSubmit = () => {
    onUpdate({ ...task, description });
  };

  const handleChange = (field: keyof typeof task, value: string | any) => {
    onUpdate({
      ...task,
      [field]: value
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'subtasks':
        const subtasks = task.subtasks || [];
        const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
        const totalSubtasks = subtasks.length;
        
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Subtasks</h3>
              <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                {completedSubtasks}/{totalSubtasks}
              </div>
            </div>
            <div className="space-y-2">
              {subtasks.length === 0 ? (
                <p className="text-sm text-gray-500">No subtasks yet</p>
              ) : (
                subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {
                        const updatedSubtasks = task.subtasks?.map(st =>
                          st.id === subtask.id ? { ...st, completed: !st.completed } : st
                        );
                        onUpdate({ ...task, subtasks: updatedSubtasks });
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{subtask.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'comments':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChatCircle className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Comments</span>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                CT
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
      case 'activities':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Activities</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                  CT
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">Calum Tyler</span> changed status to In Progress
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
      />
      
      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed right-4 top-4 bottom-4 h-auto w-[480px] rounded-lg bg-white shadow-lg z-50 flex flex-col"
      >
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X weight="bold" className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-medium text-gray-900">Task Details</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-600">
              <DotsThree weight="bold" className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto font-sans">
          <div className="p-6 space-y-6">

          {/* Title Section */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-semibold text-gray-900 border-0 p-0 focus:outline-none focus:ring-0"
                placeholder="Task title"
              />
            </div>

            {/* Status Section */}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Status</span>
              <select
                value={task.status}
                onChange={(e) => handleChange('status', e.target.value as 'todo' | 'inProgress' | 'done')}
                className="ml-auto px-3 py-1.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Tags Section */}
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Tags</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-full">Dashboard</span>
                <span className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 rounded-full">Medium</span>
              </div>
            </div>

            {/* Assignees Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Assignees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600 border-2 border-white">
                    CT
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-600 border-2 border-white">
                    DT
                  </div>
                </div>
                <button className="ml-2 text-sm text-blue-600 font-medium hover:text-blue-700">
                  Invite
                </button>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TextAlignLeft className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Description</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a more detailed description..."
              />
            </div>

            {/* Attachments Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PaperclipHorizontal weight="regular" className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Attachments (2)</span>
                </div>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  <DownloadSimple weight="bold" className="w-4 h-4" />
                  Download All
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                    <FilePdf weight="bold" className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Design brief.pdf</p>
                    <p className="text-xs text-gray-500">1,5 MB</p>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <DownloadSimple weight="bold" className="w-4 h-4" />
                    Download
                  </button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <File weight="bold" className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Crafboard logo.ai</p>
                    <p className="text-xs text-gray-500">2,5 MB</p>
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    <DownloadSimple weight="bold" className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('subtasks')}
                  className={`pb-4 px-2 text-base font-medium relative ${
                    activeTab === 'subtasks'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Subtasks
                  {activeTab === 'subtasks' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`pb-4 px-2 text-base font-medium relative ${
                    activeTab === 'comments'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Comments
                  <span className="ml-2 text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">3</span>
                  {activeTab === 'comments' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`pb-4 px-2 text-base font-medium relative ${
                    activeTab === 'activities'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Activities
                  {activeTab === 'activities' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </motion.div>
    </>
  );
} 
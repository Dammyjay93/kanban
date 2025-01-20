'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  X, 
  DotsThree, 
  Clock, 
  TextAlignLeft, 
  User, 
  CaretLeft,
  CheckSquare,
  ListChecks,
  ChatCircle,
  Activity,
  CaretDown,
  Plus,
  Trash,
  Share
} from '@phosphor-icons/react';

type Activity = {
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
};

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
  activities?: Activity[];
}

type TabType = 'subtasks' | 'comments' | 'activities';

interface TaskDrawerProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo':
      return 'bg-blue-50 text-blue-700';
    case 'inProgress':
      return 'bg-yellow-50 text-yellow-700';
    case 'done':
      return 'bg-green-50 text-green-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'inProgress':
      return 'In Progress';
    case 'done':
      return 'Done';
    default:
      return status;
  }
};

const StatusTag = ({ status }: { status: Task['status'] }) => (
  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
    {getStatusDisplay(status)}
  </span>
);

export default function TaskDrawer({ task, onClose, onUpdate }: TaskDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('subtasks');
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

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

  const handleEditSubmit = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.map(st =>
      st.id === subtaskId ? { ...st, title: editText } : st
    );
    onUpdate({ ...task, subtasks: updatedSubtasks });
    setEditingId(null);
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
        return 'bg-gray-50 text-gray-700';
    }
  };

  const handleShare = async () => {
    const taskUrl = `${window.location.origin}/task/${task.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: task.title,
          text: task.description,
          url: taskUrl
        });
      } else {
        await navigator.clipboard.writeText(taskUrl);
        // You might want to add a toast notification here
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
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
                  <div key={subtask.id} className="flex items-center gap-2 group">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {
                        const updatedSubtasks = task.subtasks?.map(st =>
                          st.id === subtask.id ? { ...st, completed: !st.completed } : st
                        ).sort((a, b) => {
                          if (a.completed === b.completed) return 0;
                          return a.completed ? 1 : -1;
                        });
                        onUpdate({ ...task, subtasks: updatedSubtasks });
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {editingId === subtask.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => handleEditSubmit(subtask.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSubmit(subtask.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="flex-1 text-sm text-gray-700 bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                        autoFocus
                      />
                    ) : (
                      <span 
                        onClick={() => {
                          setEditingId(subtask.id);
                          setEditText(subtask.title);
                        }}
                        className={`text-sm text-gray-700 flex-1 cursor-text hover:text-gray-900 ${subtask.completed ? 'line-through text-gray-400' : ''}`}
                      >
                        {subtask.title}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        const updatedSubtasks = task.subtasks?.filter(st => st.id !== subtask.id);
                        onUpdate({ ...task, subtasks: updatedSubtasks });
                      }}
                      className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
              <button
                onClick={() => {
                  const newSubtask = {
                    id: Date.now().toString(),
                    title: 'New subtask',
                    completed: false
                  };
                  onUpdate({
                    ...task,
                    subtasks: [...(task.subtasks || []), newSubtask]
                  });
                }}
                className="w-full py-2 px-3 flex text-sm items-center justify-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150"
              >
                <Plus className="w-4 h-4" />
                <span>Add new</span>
              </button>
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
            <div className="space-y-4">
              {task.activities
                ?.filter(activity => activity.type === 'comment_added')
                .map(activity => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                      {activity.userId}
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium text-gray-900">{activity.userName}</span>{' '}
                        <span className="text-gray-700">{activity.details?.comment}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            <form 
              className="flex gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const commentText = (e.target as HTMLFormElement).comment.value.trim();
                if (!commentText) return;

                const newActivity: Activity = {
                  id: Date.now().toString(),
                  type: 'comment_added',
                  message: 'Added a comment',
                  timestamp: new Date().toISOString(),
                  userId: 'CT', // This should come from your auth system
                  userName: 'Calum Tyler', // This should come from your auth system
                  details: {
                    comment: commentText
                  }
                };

                onUpdate({
                  ...task,
                  activities: [...(task.activities || []), newActivity]
                });

                // Reset the form
                (e.target as HTMLFormElement).reset();
              }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                CT
              </div>
              <div className="flex-1">
                <textarea
                  name="comment"
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  required
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </form>
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
              {task.activities?.length === 0 ? (
                <p className="text-sm text-gray-500">No activities yet</p>
              ) : (
                task.activities?.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                      {activity.userId}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.userName}</span>{' '}
                        {activity.type === 'status_change' && activity.details ? (
                          <>
                            Changed status from{' '}
                            <StatusTag status={activity.details.oldStatus!} />{' '}
                            to{' '}
                            <StatusTag status={activity.details.newStatus!} />
                          </>
                        ) : (
                          activity.message
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
        className="fixed right-4 top-4 bottom-4 h-auto w-[456px] rounded-lg bg-white shadow-lg z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50"
            >
              <X weight="bold" className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50"
              >
                <Share weight="regular" className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50">
                <DotsThree weight="bold" className="w-5 h-5" />
              </button>
            </div>
          </div>
          <h2 className="text-lg font-medium text-gray-900">Task Details</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto font-sans">
          <div className="p-6 space-y-6">
            {/* Title Section */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                className="w-full text-2xl font-semibold text-gray-900 border-0 p-0 focus:outline-none focus:ring-0"
                placeholder="Task title"
              />
            </div>

            {/* Metadata Section */}
            <div className="space-y-4">
              {/* Created Time */}
              <div className="flex items-center">
                <div className="flex items-center gap-2 w-48">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Created time</span>
                </div>
                <span className="text-sm text-gray-500">{task.createdAt}</span>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <div className="flex items-center gap-2 w-48">
                  <CheckSquare className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Status</span>
                </div>
                <div className="relative inline-block">
                  <select
                    value={task.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as Task['status'];
                      const newActivity: Activity = {
                        id: Date.now().toString(),
                        type: 'status_change',
                        message: 'Changed status',
                        timestamp: new Date().toISOString(),
                        userId: 'CT', // This should come from your auth system
                        userName: 'Calum Tyler', // This should come from your auth system
                        details: {
                          oldStatus: task.status,
                          newStatus: newStatus
                        }
                      };
                      handleChange('status', newStatus);
                      onUpdate({
                        ...task,
                        status: newStatus,
                        activities: [...(task.activities || []), newActivity]
                      });
                    }}
                    className={`w-fit appearance-none pl-2.5 pr-6 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-0 focus:outline-none ${getStatusColor(task.status)} [&>_option]:text-gray-900 [&>_option]:pl-2.5`}
                  >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <CaretDown 
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${getStatusColor(task.status).split(' ')[1]}`}
                    weight="bold"
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="flex items-center">
                <div className="flex items-center gap-2 w-48">
                  <ListChecks className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Priority</span>
                </div>
                <div className="relative inline-block">
                  <select
                    value={task.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    className="w-fit appearance-none pl-2.5 pr-6 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-0 focus:outline-none bg-gray-100 text-gray-800 [&>_option]:text-gray-900 [&>_option]:pl-2.5"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <CaretDown 
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-gray-800"
                    weight="bold"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center">
                <div className="flex items-center gap-2 w-48">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Due Date</span>
                </div>
                <input
                  type="date"
                  value={task.dueDate || ''}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="text-sm text-gray-500 bg-transparent border-0 cursor-pointer hover:text-blue-600 focus:ring-0 focus:outline-none"
                />
              </div>

              {/* Assignees */}
              <div className="flex items-center">
                <div className="flex items-center gap-2 w-48">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Assignees</span>
                </div>
                <div className="flex -space-x-2">
                  {task.assignees.map((assignee, index) => (
                    <img
                      key={assignee.id}
                      src={assignee.avatar}
                      alt={`Assignee ${index + 1}`}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TextAlignLeft className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Description</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionSubmit}
                rows={4}
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a more detailed description..."
              />
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('subtasks')}
                  className={`pb-4 px-2 text-sm font-medium relative ${
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
                  className={`pb-4 px-2 text-sm font-medium relative ${
                    activeTab === 'comments'
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Comments
                  {activeTab === 'comments' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('activities')}
                  className={`pb-4 px-2 text-sm font-medium relative ${
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
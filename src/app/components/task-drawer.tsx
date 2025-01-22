'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
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
  Activity as ActivityIcon,
  CaretDown,
  Plus,
  Trash,
  Share
} from '@phosphor-icons/react';
import { TbCalendarClock, TbFlag3, TbProgressCheck, TbShare, TbUser, TbCheckbox, TbMessage2, TbActivity, TbX, TbCheck } from 'react-icons/tb';
import { MdModeEdit } from "react-icons/md";
import PillSwitcher from './pill-switcher';
import { Task, Activity, Comment } from '../types';

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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  const [originalTitle, setOriginalTitle] = useState(title);
  const [description, setDescription] = useState(task?.description || '');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const inputRef = useRef<HTMLInputElement>(null);

  const tabOptions = [
    { id: 'subtasks', label: 'Subtasks', icon: TbCheckbox },
    { id: 'comments', label: 'Comments', icon: TbMessage2 },
    { id: 'activities', label: 'Activities', icon: TbActivity },
  ];

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setOriginalTitle(task.title);
      setDescription(task.description);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [task]);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleTitleSubmit = () => {
    if (!task) return;
    const updatedTask: Task = {
      ...task,
      title
    };
    onUpdate(updatedTask);
    setOriginalTitle(title);
    setIsEditingTitle(false);
  };

  const handleTitleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTitle(originalTitle);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(originalTitle);
      setIsEditingTitle(false);
    }
  };

  const handleDescriptionSubmit = () => {
    if (!task) return;
    const updatedTask: Task = {
      ...task,
      description
    };
    onUpdate(updatedTask);
  };

  const handleChange = (field: keyof Task, value: Task[keyof Task]) => {
    if (!task) return;
    const updatedTask: Task = {
      ...task,
      [field]: value
    };
    onUpdate(updatedTask);
  };

  const handleEditSubmit = (subtaskId: string) => {
    if (!task) return;
    const updatedSubtasks = task.subtasks?.map(st =>
      st.id === subtaskId ? { ...st, title: editText } : st
    );
    const updatedTask: Task = {
      ...task,
      subtasks: updatedSubtasks
    };
    onUpdate(updatedTask);
    setEditingId(null);
  };

  const getPriorityColor = (priority: string) => {
    if (!task) return 'bg-gray-50 text-gray-700';
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
    if (!task) return;
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

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!task) return;
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    setMousePosition({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  const renderTabContent = () => {
    if (!task) return null;
    switch (activeTab) {
      case 'subtasks':
        const subtasks = task.subtasks || [];
        const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
        const totalSubtasks = subtasks.length;
        
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TbCheckbox className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900">Subtasks</h3>
              <div className="bg-gray-50 text-gray-700 text-xs font-medium px-2 py-1 rounded">
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
                        handleChange('subtasks', updatedSubtasks);
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
                        handleChange('subtasks', updatedSubtasks);
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
                  handleChange('subtasks', [...(task.subtasks || []), newSubtask]);
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
              <TbMessage2 className="w-4 h-4 text-gray-400" />
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

                handleChange('activities', [...(task.activities || []), newActivity]);

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
              <TbActivity className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Activities</span>
            </div>
            <div className="space-y-4">
              {!task.activities?.length ? (
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

  if (!task) return null;

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
        className="fixed right-4 top-4 bottom-4 h-auto w-[440px] rounded-[24px] bg-white shadow-lg z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="text-gray-500 hover:text-gray-600 p-1 rounded hover:bg-gray-50">
                <X weight="bold" className="w-4 h-4" />
              </button>
              <h2 className="text-base font-medium text-gray-900">Task Details</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50">
                <TbShare className="w-4 h-4" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-50">
                <DotsThree weight="bold" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto font-sans">
          <div className="p-6 pt-4 space-y-6">
            {/* Title Section */}
            <div className="group cursor-pointer" onClick={() => {
              setIsEditingTitle(true);
              setOriginalTitle(title);
            }}>
              {isEditingTitle ? (
                <div className="w-fit max-w-full flex items-center gap-2 border border-[#18181B]/10 rounded-[10px]">
                  <input
                    ref={inputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xl font-medium text-gray-900 bg-transparent outline-none min-w-[1px] w-auto px-3 py-1"
                    size={title.length}
                  />
                  <div className="flex items-center gap-1 pr-2 shrink-0">
                    <button 
                      onClick={handleTitleCancel}
                      type="button"
                      className="p-1 rounded-md hover:bg-[#18181B]/[0.06]"
                    >
                      <TbX className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTitleSubmit();
                      }}
                      type="button"
                      className="p-1 rounded-md hover:bg-[#18181B]/[0.06]"
                    >
                      <TbCheck className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-fit max-w-full flex items-center gap-2">
                  <h1 className="text-xl font-medium text-gray-900 break-words">{title}</h1>
                  <div className="text-gray-400 hover:text-gray-900 group-hover:text-gray-900 hover:bg-[#18181B]/[0.04] group-hover:bg-[#18181B]/[0.04] rounded-lg p-1 -m-1 shrink-0">
                    <MdModeEdit className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Section */}
            <div className="space-y-4">
              {/* Created Time */}
              <div className="flex items-center">
                <div className="flex items-center gap-2 w-[180px] shrink-0">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-regular text-gray-900">Created time</span>
                </div>
                <span className="text-sm text-gray-500">{task.createdAt}</span>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <div className="flex items-center gap-2 w-[180px] shrink-0">
                  <TbProgressCheck className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-regular text-gray-900">Status</span>
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
                        userId: 'CT',
                        userName: 'Calum Tyler',
                        details: {
                          oldStatus: task.status,
                          newStatus: newStatus
                        }
                      };
                      handleChange('status', newStatus);
                      handleChange('activities', [...(task.activities || []), newActivity]);
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
                <div className="flex items-center gap-2 w-[180px] shrink-0">
                  <TbFlag3 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-regular text-gray-900">Priority</span>
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
                <div className="flex items-center gap-2 w-[180px] shrink-0">
                  <TbCalendarClock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-regular text-gray-900">Due Date</span>
                </div>
                <input
                  type="date"
                  value={task.dueDate || ''}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  className="text-sm text-gray-500 bg-transparent border-0 cursor-pointer hover:text-blue-600 focus:ring-0 focus:outline-none p-0 [&::-webkit-calendar-picker-indicator]:ml-[-4px]"
                />
              </div>

              {/* Assignees */}
              <div className="flex items-center">
                <div className="flex items-center gap-2 w-[180px] shrink-0">
                  <TbUser className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-regular text-gray-900">Assignees</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Coming Soon</span>
                </div>
              </div>
            </div>

            

            {/* Description */}
            <div className="space-y-2 mb-2">
              <div className="flex items-center gap-2">
                <TextAlignLeft className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-regular text-gray-900">Description</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionSubmit}
                rows={4}
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-transparent"
                placeholder="Add a more detailed description..."
              />
            </div>

            {/* Tabs */}
            <div>
              <PillSwitcher
                options={tabOptions}
                activeId={activeTab}
                onChange={(id) => setActiveTab(id as TabType)}
                fontWeight="regular"
                fullWidth
              />
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </motion.div>
    </>
  );
} 
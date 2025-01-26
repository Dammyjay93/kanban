'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  DotsThree, 
  Clock, 
  TextAlignLeft, 
  CaretDown,
  Plus,
  Trash,
  ListChecks,
  ChatCircle
} from '@phosphor-icons/react';
import { TbCalendarClock, TbFlag3, TbProgressCheck, TbShare, TbUser, TbCheckbox, TbMessage2, TbActivity, TbX, TbCheck } from 'react-icons/tb';
import { MdModeEdit } from "react-icons/md";
import PillSwitcher from './pill-switcher';
import { Task } from '../types';

type TabType = 'subtasks' | 'comments' | 'activities';

interface Comment {
  id: string;
  text: string;
  userId: string;
  timestamp: string;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Activity {
  id: string;
  type: 'status_change' | 'priority_change' | 'assignee_change' | 'comment_added';
  message: string;
  timestamp: string;
  userId: string;
  details?: {
    oldStatus?: Task['status'];
    newStatus?: Task['status'];
    comment?: string;
  };
}

interface ExtendedTask extends Omit<Task, 'subtasks' | 'activities' | 'comments'> {
  subtasks: Subtask[];
  activities: Activity[];
  comments?: Comment[];
}

const CURRENT_USER = {
  id: 'DA',
  fullName: 'Damola Akinleye',
  initials: 'DA'
};

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

export default function TaskDrawer({ task, onClose, onUpdate }: { task: ExtendedTask | null; onClose: () => void; onUpdate: (task: ExtendedTask) => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('subtasks');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(task?.title || '');
  const [originalTitle, setOriginalTitle] = useState(title);
  const [description, setDescription] = useState(task?.description || '');
  const [isEditingSubtask, setIsEditingSubtask] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const tabOptions = [
    { id: 'subtasks', label: 'Subtasks', icon: TbCheckbox, mobileLabel: '' },
    { id: 'comments', label: 'Comments', icon: TbMessage2, mobileLabel: '' },
    { id: 'activities', label: 'Activities', icon: TbActivity, mobileLabel: '' },
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
    const updatedTask: ExtendedTask = {
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
    const updatedTask: ExtendedTask = {
      ...task,
      description
    };
    onUpdate(updatedTask);
  };

  const handleChange = (field: keyof ExtendedTask, value: string | Task['status'] | Subtask[] | Comment[] | Activity[]) => {
    if (!task) return;
    const updatedTask = {
      ...task,
      [field]: value
    };
    onUpdate(updatedTask);
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

  const handleSubtaskToggle = (subtaskId: string) => {
    if (!task) return;
    const updatedSubtasks = task.subtasks?.map((st: Subtask) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    ).sort((a: Subtask, b: Subtask) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
    handleChange('subtasks', updatedSubtasks);
  };

  const handleSubtaskEditSubmit = (subtaskId: string) => {
    if (!task) return;
    const updatedSubtasks = task.subtasks?.map(st =>
      st.id === subtaskId ? { ...st, title: editingSubtaskTitle } : st
    );
    const updatedTask: ExtendedTask = {
      ...task,
      subtasks: updatedSubtasks
    };
    onUpdate(updatedTask);
    setIsEditingSubtask(null);
  };

  const handleSubtaskEditCancel = () => {
    setIsEditingSubtask(null);
  };

  const handleSubtaskEditDelete = (subtaskId: string) => {
    if (!task) return;
    const updatedSubtasks = task.subtasks?.filter((st: Subtask) => st.id !== subtaskId);
    handleChange('subtasks', updatedSubtasks);
  };

  const handleSubtaskAdd = () => {
    if (!task) return;
    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title: newSubtaskTitle,
      completed: false
    };
    handleChange('subtasks', [...(task.subtasks || []), newSubtask]);
    setIsAddingSubtask(false);
    setNewSubtaskTitle('');
  };

  const handleCommentAdd = () => {
    if (!task || !newComment.trim()) return;
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      userId: CURRENT_USER.id,
      text: newComment,
      timestamp: new Date().toISOString()
    };
    const updatedComments = [...(task.comments || []), newCommentObj];
    handleChange('comments', updatedComments);
    setNewComment('');
  };

  const renderTabContent = () => {
    if (!task) return null;
    
    switch (activeTab) {
      case 'subtasks':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-text-tertiary" />
              <h3 className="text-sm font-medium text-text-primary">Subtasks</h3>
            </div>

            <div className="space-y-2">
              {task.subtasks?.map((subtask) => (
                <div key={subtask.id} className="flex items-start gap-2 group">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleSubtaskToggle(subtask.id)}
                    className="mt-1 border-border-subtle rounded text-primary focus:ring-primary"
                  />
                  {isEditingSubtask === subtask.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editingSubtaskTitle}
                        onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSubtaskEditSubmit(subtask.id);
                          if (e.key === 'Escape') handleSubtaskEditCancel();
                        }}
                        className="flex-1 text-sm text-text-primary bg-transparent border border-border-light rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleSubtaskEditCancel}
                          className="p-1 rounded-md bg-hover-light"
                        >
                          <TbX className="w-3.5 h-3.5 text-text-secondary" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubtaskEditSubmit(subtask.id);
                          }}
                          type="button" 
                          className="p-1 rounded-md bg-hover-light"
                        >
                          <TbCheck className="w-3.5 h-3.5 text-text-secondary" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-start justify-between group">
                      <span className={`text-sm ${subtask.completed ? 'text-text-tertiary line-through' : 'text-text-primary'}`}>
                        {subtask.title}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setIsEditingSubtask(subtask.id);
                            setEditingSubtaskTitle(subtask.title);
                          }}
                          className="p-1 rounded-md hover:bg-hover-light text-text-tertiary hover:text-text-secondary"
                        >
                          <MdModeEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSubtaskEditDelete(subtask.id)}
                          className="p-1 rounded-md hover:bg-hover-light text-text-tertiary hover:text-text-secondary"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isAddingSubtask ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSubtaskAdd();
                      if (e.key === 'Escape') setIsAddingSubtask(false);
                    }}
                    className="flex-1 text-sm text-text-primary bg-transparent border border-border-light rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Add a subtask..."
                    autoFocus
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsAddingSubtask(false)}
                      className="p-1 rounded-md bg-hover-light"
                    >
                      <TbX className="w-3.5 h-3.5 text-text-secondary" />
                    </button>
                    <button
                      onClick={handleSubtaskAdd}
                      className="p-1 rounded-md bg-hover-light"
                    >
                      <TbCheck className="w-3.5 h-3.5 text-text-secondary" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingSubtask(true)}
                  className="flex items-center gap-2 text-sm text-text-tertiary hover:text-text-secondary"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add subtask</span>
                </button>
              )}
            </div>
          </div>
        );
      case 'comments':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChatCircle className="w-4 h-4 text-text-tertiary" />
              <h3 className="text-sm font-medium text-text-primary">Comments</h3>
            </div>

            <div className="space-y-4">
              {task.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-text-primary">{CURRENT_USER.initials}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">
                        {comment.userId === CURRENT_USER.id ? 'You' : CURRENT_USER.fullName}
                      </span>
                      <span className="text-xs text-text-tertiary">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{comment.text}</p>
                  </div>
                </div>
              ))}

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-text-primary">{CURRENT_USER.initials}</span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCommentAdd();
                      }
                    }}
                    placeholder="Write a comment..."
                    className="w-full min-h-[80px] text-sm text-text-secondary bg-transparent border border-border-subtle rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'activities':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-tertiary" />
              <h3 className="text-sm font-medium text-text-primary">Activity</h3>
            </div>

            <div className="space-y-4">
              {task.activities?.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-text-primary">
                      {CURRENT_USER.initials}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">
                        {activity.userId === CURRENT_USER.id ? 'You' : CURRENT_USER.fullName}
                      </span>
                      <span className="text-xs text-text-tertiary">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {activity.type === 'status_change' && activity.details && (
                        <>Changed status from {getStatusDisplay(activity.details.oldStatus || '')} to {getStatusDisplay(activity.details.newStatus || '')}</>
                      )}
                      {activity.type === 'comment_added' && activity.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const springConfig = {
    type: 'spring',
    damping: 24,
    stiffness: 240,
    restDelta: 0.1,
    restSpeed: 0.1
  };

  const dragConfig = {
    drag: 'y' as const,
    dragDirectionLock: true,
    dragElastic: 0.7,
    dragConstraints: { 
      top: 0,
      bottom: 0 
    }
  };

  const onDragEnd = (event: PointerEvent, info: { offset: { y: number }, velocity: { y: number } }) => {
    if (info.offset.y > 100 || info.velocity.y > 300) {
      onClose();
    }
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type: 'status_change',
      message: 'Changed status',
      timestamp: new Date().toISOString(),
      userId: CURRENT_USER.id,
      details: {
        oldStatus: task?.status,
        newStatus: newStatus
      }
    };
    
    if (!task) return;
    const updatedTask = {
      ...task,
      status: newStatus,
      activities: [...(task.activities || []), newActivity]
    };
    
    onUpdate(updatedTask);
  };

  return (
    <AnimatePresence>
      {task && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          <motion.div
            key="drawer"
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={{ 
              y: isMobile ? 0 : undefined,
              x: isMobile ? undefined : 0,
              transition: springConfig
            }}
            exit={{ 
              y: isMobile ? '100%' : undefined,
              x: isMobile ? undefined : '100%',
              transition: springConfig
            }}
            {...(isMobile && dragConfig)}
            onDragEnd={isMobile ? onDragEnd : undefined}
            className={
              isMobile 
                ? 'fixed left-2 right-2 bottom-2 bg-surface-primary shadow-lg z-50 flex flex-col rounded-[24px] overflow-hidden h-[75vh]'
                : 'fixed right-4 top-4 bottom-4 h-auto w-[440px] rounded-[24px] bg-surface-primary shadow-lg z-50 flex flex-col overflow-hidden'
            }
          >
            {isMobile && (
              <div className="w-full flex justify-center pt-2 pb-1">
                <div className="w-8 h-1 rounded-full bg-surface-secondary" />
              </div>
            )}
            
            {/* Header */}
            <div className="sticky top-0 bg-surface-overlay backdrop-blur-md border-b border-border-subtle z-10 rounded-t-[24px]">
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={onClose} className="text-text-tertiary hover:text-text-secondary p-1 rounded hover:bg-hover-light">
                    <X weight="bold" className="w-4 h-4" />
                  </button>
                  <h2 className="text-base font-medium text-text-primary">Task Details</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleShare} className="text-text-tertiary hover:text-text-secondary p-1 rounded hover:bg-hover-light">
                    <TbShare className="w-4 h-4" />
                  </button>
                  <button className="text-text-tertiary hover:text-text-secondary p-1 rounded hover:bg-hover-light">
                    <DotsThree weight="bold" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden font-sans">
              <div className="p-6 pt-4 space-y-6">
                {/* Title Section */}
                <div className="group cursor-pointer" onClick={() => {
                  setIsEditingTitle(true);
                  setOriginalTitle(title);
                }}>
                  {isEditingTitle ? (
                    <div className="w-fit max-w-full flex items-center gap-2 border border-border-light rounded-[10px]">
                      <input
                        ref={inputRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xl font-medium text-text-primary bg-transparent outline-none min-w-[1px] w-auto px-3 py-1"
                        size={title.length}
                      />
                      <div className="flex items-center gap-1 pr-2 shrink-0">
                        <button 
                          onClick={handleTitleCancel}
                          type="button"
                          className="p-1 rounded-md bg-hover-light"
                        >
                          <TbX className="w-3.5 h-3.5 text-text-secondary" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTitleSubmit();
                          }}
                          type="button" 
                          className="p-1 rounded-md bg-hover-light"
                        >
                          <TbCheck className="w-3.5 h-3.5 text-text-secondary" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-fit max-w-full flex items-center gap-2">
                      <h1 className="text-xl font-medium text-text-primary break-words">{title}</h1>
                      <div className="text-text-tertiary hover:text-text-secondary group-hover:opacity-100 opacity-0 transition-opacity">
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
                      <Clock className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm font-regular text-text-primary">Created time</span>
                    </div>
                    <span className="text-sm text-text-secondary">{task.createdAt}</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 w-[180px] shrink-0">
                      <TbProgressCheck className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm font-regular text-text-primary">Status</span>
                    </div>
                    <div className="relative inline-block">
                      <select
                        value={task.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as Task['status'];
                          handleStatusChange(newStatus);
                        }}
                        className={`w-fit appearance-none pl-2.5 pr-6 py-1 rounded-full text-sm font-medium border-0 cursor-pointer focus:ring-0 focus:outline-none ${getStatusColor(task.status)} [&>_option]:text-text-primary [&>_option]:pl-2.5`}
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
                      <TbFlag3 className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm font-regular text-text-primary">Priority</span>
                    </div>
                    <div className="relative inline-block">
                      <select
                        value={task.priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                        className="w-fit appearance-none pl-2.5 pr-6 py-1 rounded-full text-sm font-medium border-0 cursor-pointer focus:ring-0 focus:outline-none bg-surface-secondary text-text-primary [&>_option]:text-text-primary [&>_option]:pl-2.5"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <CaretDown 
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-text-secondary"
                        weight="bold"
                      />
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 w-[180px] shrink-0">
                      <TbCalendarClock className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm font-regular text-text-primary">Due Date</span>
                    </div>
                    <div className="relative inline-block">
                      <input
                        type="date"
                        value={task.dueDate || ''}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                        className="text-sm text-text-primary appearance-none bg-surface-secondary rounded-full px-2.5 py-1 cursor-pointer focus:ring-0 focus:outline-none min-w-[130px] border border-border-light hover:border-border-subtle transition-colors [&::-webkit-calendar-picker-indicator]:text-text-primary [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:invert"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const dateInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                          dateInput.showPicker();
                        }}
                        className="absolute inset-0 w-full h-full opacity-0"
                        aria-label="Select date"
                      />
                    </div>
                  </div>

                  {/* Assignees */}
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 w-[180px] shrink-0">
                      <TbUser className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm font-regular text-text-primary">Assignees</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium bg-surface-secondary text-text-primary px-2.5 py-1.5 rounded-full">Coming Soon</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 mb-2">
                  <div className="flex items-center gap-2">
                    <TextAlignLeft className="w-4 h-4 text-text-tertiary" />
                    <span className="text-sm font-regular text-text-primary">Description</span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={handleDescriptionSubmit}
                    rows={4}
                    className="w-full px-3 py-2 text-sm text-text-secondary bg-transparent border border-border-subtle rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Add a more detailed description..."
                  />
                </div>

                {/* Tabs */}
                <div className={`${isMobile ? 'w-fit' : 'w-full'}`}>
                  <PillSwitcher
                    options={tabOptions}
                    activeId={activeTab}
                    onChange={(id) => setActiveTab(id as TabType)}
                    fontWeight="regular"
                    fullWidth={!isMobile}
                  />
                </div>

                {/* Tab Content */}
                {renderTabContent()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 
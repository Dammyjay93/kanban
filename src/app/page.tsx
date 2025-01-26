'use client';

import { useState, useRef, useEffect } from 'react';
import { MdModeEdit } from "react-icons/md";
import { TbX, TbCheck } from "react-icons/tb";
import { AnimatePresence, motion } from 'framer-motion';
import KanbanBoard from './components/kanban-board';
import ViewSwitcher from './components/view-switcher';
import HeaderActions from './components/header-actions';

type ViewType = 'board' | 'list' | 'timeline' | 'calendar';

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>('board');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('Untitled Board');
  const [originalTitle, setOriginalTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTitle = localStorage.getItem('board-title');
    if (savedTitle) {
      setTitle(savedTitle);
      setOriginalTitle(savedTitle);
    }
  }, []);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(originalTitle);
      setIsEditingTitle(false);
    }
  };

  const handleTitleSubmit = () => {
    setOriginalTitle(title);
    setIsEditingTitle(false);
    localStorage.setItem('board-title', title);
  };

  const handleTitleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTitle(originalTitle);
    setIsEditingTitle(false);
  };

  const handleShare = async () => {
    const boardUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this Kanban board: ${title}`,
          url: boardUrl
        });
      } else {
        await navigator.clipboard.writeText(boardUrl);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'board':
        return (
          <motion.div
            key="board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <KanbanBoard />
          </motion.div>
        );
      case 'list':
      case 'timeline':
      case 'calendar':
        return (
          <motion.div
            key={activeView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center min-h-[600px]"
          >
            <p className="text-text-secondary">{activeView.charAt(0).toUpperCase() + activeView.slice(1)} view coming soon...</p>
          </motion.div>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-[var(--pattern-bg)] fixed-pattern" />
      <div className="relative flex flex-col h-[100dvh] overflow-hidden">
        <div className="sticky top-0 w-full bg-surface-overlay backdrop-blur-md shadow-sm z-10">
          <div className="w-full max-w-5xl mx-auto px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 text-text-primary">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.2426 7.75736C18.5858 10.1005 18.5858 13.8995 16.2426 16.2426C13.8995 18.5858 10.1005 18.5858 7.75736 16.2426C5.41421 13.8995 5.41421 10.1005 7.75736 7.75736C10.1005 5.41421 13.8995 5.41421 16.2426 7.75736" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-text-primary">Kanbanify</span>
                </div>
                <div className="block sm:hidden">
                  <HeaderActions onShare={handleShare} />
                </div>
                <div className="hidden sm:block w-px h-4 bg-border-subtle" />
                <div className="hidden sm:block flex-1">
                  <div className="flex items-center gap-2 h-8 cursor-pointer" onClick={() => {
                    setIsEditingTitle(true);
                    setOriginalTitle(title);
                  }}>
                    {isEditingTitle ? (
                      <div className="flex items-center gap-2 border border-border-light rounded-[10px]">
                        <input
                          ref={inputRef}
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onClick={(e) => e.stopPropagation()}
                          className="text-lg font-medium text-text-primary bg-transparent outline-none min-w-[1px] w-auto px-3 py-1"
                          size={title.length}
                        />
                        <div className="flex items-center gap-1 pr-2">
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
                      <>
                        <h1 className="text-lg font-medium text-text-secondary group-hover:text-text-primary">{title}</h1>
                        <div className="text-text-tertiary hover:text-text-primary group-hover:text-text-primary hover:bg-hover-subtle group-hover:bg-hover-subtle rounded-lg p-1 -m-1">
                          <MdModeEdit className="w-4 h-4" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="block sm:hidden group flex items-center gap-2 h-8 cursor-pointer mb-4" onClick={() => {
                  setIsEditingTitle(true);
                  setOriginalTitle(title);
                }}>
                  {isEditingTitle ? (
                    <div className="flex items-center gap-2 border border-border-light rounded-[10px]">
                      <input
                        ref={inputRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        className="text-lg font-medium text-text-primary bg-transparent outline-none min-w-[1px] w-auto px-3 py-1"
                        size={title.length}
                      />
                      <div className="flex items-center gap-1 pr-2">
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
                    <>
                      <h1 className="text-lg font-medium text-text-secondary group-hover:text-text-primary">{title}</h1>
                      <div className="text-text-tertiary hover:text-text-primary group-hover:text-text-primary hover:bg-hover-subtle group-hover:bg-hover-subtle rounded-lg p-1 -m-1">
                        <MdModeEdit className="w-4 h-4" />
                      </div>
                    </>
                  )}
                </div>
                <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
                <div className="hidden sm:block">
                  <HeaderActions onShare={handleShare} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="w-full max-w-5xl mx-auto px-6 py-6">
            <div className={activeView !== 'board' ? 'bg-surface-primary rounded-lg shadow-sm' : ''}>
              <AnimatePresence mode="wait">
                {renderContent()}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

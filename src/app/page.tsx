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
        // You might want to add a toast notification here
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    // Theme implementation will go here
    console.log('Theme changed to:', theme);
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
            <p className="text-gray-500">{activeView.charAt(0).toUpperCase() + activeView.slice(1)} view coming soon...</p>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F7] [background-image:radial-gradient(#CDD0DB_1px,#F6F6F7_1px)] [background-size:20px_20px] flex flex-col">
      <header className="flex-shrink-0 fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 text-gray-900">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.2426 7.75736C18.5858 10.1005 18.5858 13.8995 16.2426 16.2426C13.8995 18.5858 10.1005 18.5858 7.75736 16.2426C5.41421 13.8995 5.41421 10.1005 7.75736 7.75736C10.1005 5.41421 13.8995 5.41421 16.2426 7.75736" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-900">Kanbanify</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="group flex items-center gap-2 h-8 cursor-pointer" onClick={() => {
                setIsEditingTitle(true);
                setOriginalTitle(title);
              }}>
                {isEditingTitle ? (
                  <div className="flex items-center gap-2 border border-[#18181B]/10 rounded-[10px]">
                    <input
                      ref={inputRef}
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onClick={(e) => e.stopPropagation()}
                      className="text-lg font-medium text-gray-900 bg-transparent outline-none min-w-[1px] w-auto px-3 py-1"
                      size={title.length}
                    />
                    <div className="flex items-center gap-1 pr-2">
                      <button 
                        onClick={handleTitleCancel}
                        type="button"
                        className="p-1 rounded-md bg-[#18181B]/[0.06]"
                      >
                        <TbX className="w-3.5 h-3.5 text-gray-700" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTitleSubmit();
                        }}
                        type="button" 
                        className="p-1 rounded-md bg-[#18181B]/[0.06]"
                      >
                        <TbCheck className="w-3.5 h-3.5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-lg font-medium text-gray-600 group-hover:text-gray-900">{title}</h1>
                    <div className="text-gray-400 hover:text-gray-900 group-hover:text-gray-900 hover:bg-[#18181B]/[0.04] group-hover:bg-[#18181B]/[0.04] rounded-lg p-1 -m-1">
                      <MdModeEdit className="w-4 h-4" />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
              <HeaderActions onShare={handleShare} onThemeChange={handleThemeChange} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full pt-[156px] pb-6">
        <div className={`p-6 min-h-[calc(100vh-156px-1.5rem)] ${
          activeView !== 'board' ? 'bg-white rounded-lg shadow-sm' : ''
        }`}>
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

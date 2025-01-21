'use client';

import { useState, useRef, useEffect } from 'react';
import { MdModeEdit } from "react-icons/md";
import KanbanBoard from './components/kanban-board';
import ViewSwitcher from './components/view-switcher';
import HeaderActions from './components/header-actions';

type ViewType = 'board' | 'list' | 'timeline' | 'calendar';

export default function Home() {
  const [activeView, setActiveView] = useState<ViewType>('board');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('Task Boards');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
    }
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
        return <KanbanBoard />;
      case 'list':
      case 'timeline':
      case 'calendar':
        return (
          <div className="flex items-center justify-center h-[600px] bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">{activeView.charAt(0).toUpperCase() + activeView.slice(1)} view coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="app-container min-h-screen flex flex-col overscroll-none">
      <div className="fixed inset-0 bg-[#F6F6F7] [background-image:radial-gradient(#CDD0DB_1px,#F6F6F7_1px)] [background-size:20px_20px]" />
      <header className="header-container fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-10">
        <div className="header-content max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="header-sections space-y-4">
            <div className="title-section flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleKeyDown}
                  className="title-input text-2xl font-bold text-gray-900 bg-transparent border-b-1 border-blue-500 outline-none px-1"
                />
              ) : (
                <h1 className="board-title text-2xl font-bold text-gray-900">{title}</h1>
              )}
              <button 
                onClick={() => setIsEditingTitle(true)}
                className="edit-title-button text-gray-400 hover:text-gray-600"
              >
                <MdModeEdit className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
              <HeaderActions onShare={handleShare} onThemeChange={handleThemeChange} />
            </div>
          </div>
        </div>
      </header>
      <main className="w-full">
        <div className="main-content max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[156px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { PencilSimple } from '@phosphor-icons/react';
import KanbanBoard from './components/kanban-board';
import TabSelector from './components/tab-selector';
import ViewSwitcher from './components/view-switcher';

type TabType = 'kanban' | 'timeline';
type ViewType = 'board' | 'list';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('kanban');
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

  const renderContent = () => {
    if (activeTab === 'timeline') {
      return (
        <div className="flex items-center justify-center h-[600px] bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Timeline view coming soon...</p>
        </div>
      );
    }

    return activeView === 'board' ? (
      <KanbanBoard />
    ) : (
      <div className="flex items-center justify-center h-[600px] bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">List view coming soon...</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleKeyDown}
                  className="text-2xl font-bold text-gray-900 bg-transparent border-b-1 border-blue-500 outline-none px-1"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              )}
              <button 
                onClick={() => setIsEditingTitle(true)}
                className="text-gray-400 hover:text-gray-600"
              >
                <PencilSimple weight="regular" className="w-5 h-5" />
              </button>
            </div>
            <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          {activeTab === 'kanban' && (
            <ViewSwitcher activeView={activeView} onViewChange={setActiveView} />
          )}
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

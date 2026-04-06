/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Home, ClipboardList, Activity, User, Settings } from 'lucide-react';
import { useTranslation, Language } from '../lib/i18n';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language?: Language;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, language = 'English' }) => {
  const { t } = useTranslation(language);
  const tabs = [
    { id: 'dashboard', icon: Home, label: t('dashboard') },
    { id: 'tasks', icon: ClipboardList, label: t('tasks') },
    { id: 'recovery', icon: Activity, label: t('recovery') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">RecoverX</h1>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <Settings className="w-5 h-5 text-blue-600" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center shadow-lg shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-blue-50' : ''}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HeartHandshake, 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Settings as SettingsIcon, 
  Smartphone, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

// Data and Types
import { Patient, NotificationItem, CaregiverSettings } from './types';
import { INITIAL_PATIENTS, INITIAL_NOTIFICATIONS, DEFAULT_SETTINGS } from './data';

// Components
import LandingPage from './components/LandingPage';
import CaregiverDashboard from './components/CaregiverDashboard';
import RecoveryReport from './components/RecoveryReport';
import NotificationCenter from './components/NotificationCenter';
import SettingsPage from './components/SettingsPage';
import MobileSimulator from './components/MobileSimulator';

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-1');
  
  // Sidebar state for smaller screens
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Synchronized States
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<CaregiverSettings>(DEFAULT_SETTINGS);

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const handleUpdateNotifications = (updatedList: NotificationItem[]) => {
    setNotifications(updatedList);
  };

  const handleUpdateSettings = (updatedSettings: CaregiverSettings) => {
    setSettings(updatedSettings);
  };

  // Safe navigation between landing or dashboard tabs
  const handleNavigate = (tab: string, patientId?: string) => {
    setActiveTab(tab);
    if (patientId) {
      setSelectedPatientId(patientId);
    }
    setSidebarOpen(false); // Close sidebar on mobile
  };

  // Helper count for unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  const isDark = settings.theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#090D1A] text-white' : 'bg-[#fdfdff] text-slate-900'} font-sans antialiased`}>
      
      {/* 1. Landing Page View (Fullscreen, no sidebar) */}
      <AnimatePresence mode="wait">
        {activeTab === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingPage onEnterApp={handleNavigate} />
          </motion.div>
        ) : (
          
          /* 2. Main Workspace Layout (Sidebar + Top bar + Content Frame) */
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-screen relative overflow-hidden"
          >
            
            {/* Background design elements */}
            {isDark ? (
              <>
                <div className="absolute top-[-30%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-blue-600/5 to-indigo-600/5 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-purple-600/5 to-blue-600/5 blur-[100px] pointer-events-none" />
              </>
            ) : (
              <>
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-purple-400/5 to-blue-500/5 rounded-full blur-3xl pointer-events-none" />
              </>
            )}

            {/* Sidebar Navigation */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 ${isDark ? 'bg-[#0d1326] border-white/5' : 'bg-white border-slate-100'} border-r p-5 flex flex-col justify-between transition-transform duration-300 transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:h-screen lg:shrink-0 shadow-sm`}>
              
              <div className="space-y-8">
                {/* Brand Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigate('landing')}>
                    <div className="p-2 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/15">
                      <HeartHandshake className="w-5 h-5 text-white" />
                    </div>
                    <span className={`font-display font-extrabold text-lg tracking-tight ${isDark ? 'bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent' : 'text-slate-800'}`}>
                      RecoverX
                    </span>
                  </div>
                  
                  {/* Close trigger for mobile */}
                  <button onClick={() => setSidebarOpen(false)} className={`lg:hidden ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'} cursor-pointer`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Patient list selector in sidebar menu */}
                <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-100'} text-xs`}>
                  <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-mono text-[9px] block uppercase tracking-wider mb-2`}>Selected Case</span>
                  <select 
                    value={selectedPatientId} 
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className={`w-full ${isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'} border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer text-xs font-semibold`}
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Primary Navigation list */}
                <nav className="space-y-1.5">
                  <button 
                    onClick={() => handleNavigate('dashboard')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                      activeTab === 'dashboard' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow' 
                        : isDark 
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4.5 h-4.5" />
                    <span>Care Dashboard</span>
                  </button>

                  <button 
                    onClick={() => handleNavigate('report')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                      activeTab === 'report' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow' 
                        : isDark 
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4.5 h-4.5" />
                    <span>Weekly Reports</span>
                  </button>

                  <button 
                    onClick={() => handleNavigate('notifications')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                      activeTab === 'notifications' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow' 
                        : isDark 
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Bell className="w-4.5 h-4.5" />
                      <span>Alert Center</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <button 
                    onClick={() => handleNavigate('settings')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                      activeTab === 'settings' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow' 
                        : isDark 
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <SettingsIcon className="w-4.5 h-4.5" />
                    <span>System Settings</span>
                  </button>

                  <button 
                    onClick={() => handleNavigate('mobile')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                      activeTab === 'mobile' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow' 
                        : isDark 
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4.5 h-4.5" />
                    <span>Mobile Simulator</span>
                  </button>
                </nav>
              </div>

              {/* Sidebar bottom footer */}
              <div className={`space-y-4 pt-4 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                <div className="flex items-center space-x-2.5 px-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    PS
                  </div>
                  <div className="text-left">
                    <span className={`text-[11px] font-bold ${isDark ? 'text-white' : 'text-slate-800'} block truncate max-w-[150px]`}>{settings.profileName}</span>
                    <span className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'} block truncate max-w-[150px]`}>RN Lead Coordinator</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleNavigate('landing')}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'} text-xs font-medium cursor-pointer rounded-xl transition-all`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit Workspace</span>
                </button>
              </div>

            </aside>

            {/* Mobile Sidebar overlay curtain */}
            {sidebarOpen && (
              <div 
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              />
            )}

            {/* Content Container Frame */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              
              {/* Workspace Top Header Bar */}
              <header className={`h-16 ${isDark ? 'border-b border-white/5 bg-[#0d1326]/60' : 'border-b border-slate-100 bg-white/60'} px-6 flex justify-between items-center backdrop-blur shrink-0`}>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setSidebarOpen(true)}
                    className={`lg:hidden p-2 rounded-xl ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'} cursor-pointer`}
                  >
                    <Menu className="w-5.5 h-5.5" />
                  </button>
                  
                  <div className={`hidden sm:flex items-center space-x-2 text-[10px] tracking-wide font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <ShieldCheck className={`w-4.5 h-4.5 ${isDark ? 'text-indigo-400' : 'text-blue-500'}`} />
                    <span>SECURED CLINICAL DESKTOP INTERFACE</span>
                    <span>•</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>ONLINE</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Simple stats shortcuts */}
                  <div className={`hidden md:flex items-center space-x-2.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <div className={`px-2.5 py-1 rounded-lg ${isDark ? 'bg-white/5 border border-white/5' : 'bg-white border border-slate-200'} flex items-center space-x-1.5 shadow-sm`}>
                      <UserCheck className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-blue-500'}`} />
                      <span>Case: {patients.find(p => p.id === selectedPatientId)?.name}</span>
                    </div>
                  </div>

                  {/* Settings toggle */}
                  <button 
                    onClick={() => handleNavigate('settings')}
                    className={`p-2.5 rounded-xl ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800'} cursor-pointer transition-colors shadow-sm`}
                  >
                    <SettingsIcon className="w-4.5 h-4.5" />
                  </button>
                </div>
              </header>

              {/* Workspace Content Router Viewport */}
              <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {activeTab === 'dashboard' && (
                      <CaregiverDashboard 
                        patients={patients}
                        onUpdatePatient={handleUpdatePatient}
                        selectedPatientId={selectedPatientId}
                        onSelectPatient={setSelectedPatientId}
                        isDark={isDark}
                      />
                    )}

                    {activeTab === 'report' && (
                      <RecoveryReport 
                        patients={patients}
                        selectedPatientId={selectedPatientId}
                      />
                    )}

                    {activeTab === 'notifications' && (
                      <NotificationCenter 
                        notifications={notifications}
                        onUpdateNotifications={handleUpdateNotifications}
                        onEnterApp={handleNavigate}
                        patients={patients.map(p => ({ id: p.id, name: p.name }))}
                      />
                    )}

                    {activeTab === 'settings' && (
                      <SettingsPage 
                        settings={settings}
                        onUpdateSettings={handleUpdateSettings}
                      />
                    )}

                    {activeTab === 'mobile' && (
                      <MobileSimulator 
                        patients={patients}
                        notifications={notifications}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </main>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

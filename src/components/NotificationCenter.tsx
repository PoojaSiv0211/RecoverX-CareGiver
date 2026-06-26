/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NotificationItem } from '../types';
import { 
  Bell, 
  AlertCircle, 
  AlertTriangle, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  Check, 
  Trash2,
  Filter,
  User,
  HeartHandshake
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onUpdateNotifications: (updatedList: NotificationItem[]) => void;
  onEnterApp: (tab: string, patientId?: string) => void;
  patients: { id: string; name: string }[];
}

export default function NotificationCenter({ 
  notifications, 
  onUpdateNotifications, 
  onEnterApp,
  patients
}: NotificationCenterProps) {
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'emergency' | 'medication_alert' | 'appointment' | 'ai_suggestion'>('all');

  // Toggle Read Status
  const handleToggleRead = (id: string) => {
    const updated = notifications.map(n => {
      if (n.id === id) {
        return { ...n, read: !n.read };
      }
      return n;
    });
    onUpdateNotifications(updated);
  };

  // Mark All as Read
  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    onUpdateNotifications(updated);
  };

  // Dismiss / Delete Notification
  const handleDismiss = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    onUpdateNotifications(updated);
  };

  // Clear All Notifications
  const handleClearAll = () => {
    onUpdateNotifications([]);
  };

  // Get matching patient ID by name to navigate on Action click
  const getPatientIdByName = (name: string) => {
    const p = patients.find(pat => pat.name === name);
    return p ? p.id : '';
  };

  // Filtered list
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  // Icon mapping
  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'medication_alert':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-blue-400" />;
      case 'milestone':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'ai_suggestion':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  // Background gradient based on notification severity
  const getBGColor = (type: string, read: boolean) => {
    if (read) return 'bg-[#0d1326]/40 border-white/5 opacity-70';
    switch (type) {
      case 'emergency':
        return 'bg-rose-950/10 border-rose-500/20';
      case 'medication_alert':
        return 'bg-amber-950/10 border-amber-500/10';
      case 'ai_suggestion':
        return 'bg-purple-950/10 border-purple-500/15';
      default:
        return 'bg-blue-950/10 border-blue-500/10';
    }
  };

  return (
    <div className="space-y-6 p-1 md:p-4 max-w-4xl mx-auto">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" />
            <span>Caregiver Notification Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time critical health updates, medication misses, clinical appointments, and active AI recovery advice.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button 
            onClick={handleMarkAllRead}
            disabled={notifications.length === 0}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:pointer-events-none border border-white/10 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Mark All Read
          </button>
          
          <button 
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-semibold text-rose-400 transition-colors cursor-pointer"
          >
            Clear Inbox
          </button>
        </div>
      </div>

      {/* Filters list */}
      <div className="flex flex-wrap items-center gap-2">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
            activeFilter === 'all' ? 'bg-indigo-600 text-white shadow' : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          All Updates ({notifications.length})
        </button>
        <button 
          onClick={() => setActiveFilter('emergency')}
          className={`px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeFilter === 'emergency' ? 'bg-rose-600 text-white shadow' : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Emergencies ({notifications.filter(n => n.type === 'emergency').length})</span>
        </button>
        <button 
          onClick={() => setActiveFilter('medication_alert')}
          className={`px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeFilter === 'medication_alert' ? 'bg-amber-600 text-white shadow' : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Reminders ({notifications.filter(n => n.type === 'medication_alert').length})</span>
        </button>
        <button 
          onClick={() => setActiveFilter('ai_suggestion')}
          className={`px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeFilter === 'ai_suggestion' ? 'bg-purple-600 text-white shadow' : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Suggestions ({notifications.filter(n => n.type === 'ai_suggestion').length})</span>
        </button>
      </div>

      {/* Notifications stack */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="glass text-center py-12 rounded-2xl">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-white">All Alerts Addressed!</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">There are no outstanding care alerts in your selected category.</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${getBGColor(notification.type, notification.read)}`}
            >
              <div className="flex items-start space-x-3.5">
                {/* Visual Icon indicator */}
                <div className="mt-1">
                  {getIcon(notification.type)}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h4 className={`font-bold font-display text-sm ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                      {notification.title}
                    </h4>
                    
                    {/* Unread dot */}
                    {!notification.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
                    {notification.message}
                  </p>

                  <div className="flex items-center space-x-3 mt-2.5 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <strong>Patient:</strong> {notification.patientName}
                    </span>
                    <span>•</span>
                    <span>{notification.time}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0 md:self-center">
                
                {/* Take action trigger (go to patient dashboard directly!) */}
                <button
                  onClick={() => {
                    const patId = getPatientIdByName(notification.patientName);
                    if (patId) {
                      onEnterApp('dashboard', patId);
                    } else {
                      onEnterApp('dashboard');
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-tight shadow-md cursor-pointer flex items-center space-x-1"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Address Alert</span>
                </button>

                {/* Mark as read checkbox button */}
                <button
                  onClick={() => handleToggleRead(notification.id)}
                  title={notification.read ? "Mark Unread" : "Mark Read"}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 cursor-pointer"
                >
                  <Check className={`w-4 h-4 ${notification.read ? 'text-emerald-400' : ''}`} />
                </button>

                {/* Dismiss button */}
                <button
                  onClick={() => handleDismiss(notification.id)}
                  title="Dismiss notification"
                  className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/5 text-slate-300 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

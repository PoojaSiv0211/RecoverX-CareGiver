/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CaregiverSettings } from '../types';
import { 
  User, 
  Bell, 
  Volume2, 
  Globe, 
  PhoneCall, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Save, 
  Key,
  Database,
  Check
} from 'lucide-react';

interface SettingsPageProps {
  settings: CaregiverSettings;
  onUpdateSettings: (updatedSettings: CaregiverSettings) => void;
}

export default function SettingsPage({ settings, onUpdateSettings }: SettingsPageProps) {
  
  // Local states mimicking forms
  const [profileName, setProfileName] = useState(settings.profileName);
  const [profileEmail, setProfileEmail] = useState(settings.profileEmail);
  const [role, setRole] = useState(settings.role);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notificationsEnabled);
  const [voiceAssistant, setVoiceAssistant] = useState(settings.voiceAssistant);
  const [language, setLanguage] = useState(settings.language);
  
  const [emergencyContactName, setEmergencyContactName] = useState(settings.emergencyContactName);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(settings.emergencyContactPhone);
  
  const [privacyMode, setPrivacyMode] = useState(settings.privacyMode);
  const [theme, setTheme] = useState(settings.theme);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CaregiverSettings = {
      profileName,
      profileEmail,
      role,
      notificationsEnabled,
      voiceAssistant,
      language,
      emergencyContactName,
      emergencyContactPhone,
      privacyMode,
      theme
    };
    onUpdateSettings(updated);
    triggerToast("Caregiver profiles and workspace parameters synced successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-1 md:p-4 relative">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-xl bg-indigo-600 text-white font-medium text-xs shadow-2xl flex items-center space-x-2 border border-indigo-400">
          <Check className="w-4.5 h-4.5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white/5 pb-5">
        <h2 className="font-display font-extrabold text-2xl text-white">System Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Adjust clinical profile data, notification intervals, integrated medical devices, and secure privacy shields.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Card */}
        <div className="glass p-5 rounded-2xl space-y-4">
          <h3 className="font-display font-bold text-base text-indigo-300 flex items-center gap-2 border-b border-white/5 pb-2">
            <User className="w-4.5 h-4.5 text-indigo-400" />
            <span>Caregiver Profile</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs text-slate-300">
              <label className="font-bold">Full Profile Name</label>
              <input 
                type="text" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mt-1"
              />
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <label className="font-bold">Active Title / Role</label>
              <input 
                type="text" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mt-1"
              />
            </div>

            <div className="space-y-1 text-xs text-slate-300 md:col-span-2">
              <label className="font-bold">Verified Email Address</label>
              <input 
                type="email" 
                value={profileEmail} 
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mt-1"
              />
            </div>
          </div>
        </div>

        {/* Notifications & AI Assist preferences */}
        <div className="glass p-5 rounded-2xl space-y-4">
          <h3 className="font-display font-bold text-base text-indigo-300 flex items-center gap-2 border-b border-white/5 pb-2">
            <Bell className="w-4.5 h-4.5 text-indigo-400" />
            <span>Preferences & Integration</span>
          </h3>

          <div className="space-y-4 text-xs">
            
            {/* Toggle 1: Notifications */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">Real-time Telemetry Alerts</span>
                <span className="text-slate-400 text-[11px]">Receive push warnings regarding cardiac or compliance spikes instantly.</span>
              </div>
              <input 
                type="checkbox" 
                checked={notificationsEnabled} 
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-5 h-5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500 mt-0.5"
              />
            </div>

            {/* Toggle 2: Voice Assist */}
            <div className="flex items-start justify-between gap-4 pt-3 border-t border-white/5">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">Integrated Voice Prompts</span>
                <span className="text-slate-400 text-[11px]">Read daily clinical schedules and exercise regimens aloud for senior compliance.</span>
              </div>
              <input 
                type="checkbox" 
                checked={voiceAssistant} 
                onChange={() => setVoiceAssistant(!voiceAssistant)}
                className="w-5 h-5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500 mt-0.5"
              />
            </div>

            {/* Selector: Language */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">Language & Articulation</span>
                <span className="text-slate-400 text-[11px]">Primary language used for AI translations and summary report generations.</span>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="English (US)">English (US)</option>
                <option value="Spanish (ES)">Spanish (ES)</option>
                <option value="French (FR)">French (FR)</option>
                <option value="German (DE)">German (DE)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Emergency Contacts card */}
        <div className="glass p-5 rounded-2xl space-y-4">
          <h3 className="font-display font-bold text-base text-indigo-300 flex items-center gap-2 border-b border-white/5 pb-2">
            <PhoneCall className="w-4.5 h-4.5 text-indigo-400" />
            <span>Emergency Clinician Hotline</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs text-slate-300">
              <label className="font-bold">Clinic Specialist Name</label>
              <input 
                type="text" 
                value={emergencyContactName} 
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mt-1"
              />
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <label className="font-bold">Specialist Pager / Phone</label>
              <input 
                type="text" 
                value={emergencyContactPhone} 
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mt-1"
              />
            </div>
          </div>
        </div>

        {/* Privacy & Theme switches */}
        <div className="glass p-5 rounded-2xl space-y-4">
          <h3 className="font-display font-bold text-base text-indigo-300 flex items-center gap-2 border-b border-white/5 pb-2">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-400" />
            <span>Workspace Security & Theme</span>
          </h3>

          <div className="space-y-4 text-xs">
            
            {/* Privacy switch */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">Patient Privacy Shield Mode</span>
                <span className="text-slate-400 text-[11px]">Anonymize patient names as initials in visual dashboard menus for secure, privacy-focused outpatient clinical displays.</span>
              </div>
              <input 
                type="checkbox" 
                checked={privacyMode} 
                onChange={() => setPrivacyMode(!privacyMode)}
                className="w-5 h-5 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-500 mt-0.5"
              />
            </div>

            {/* Theme switch */}
            <div className="flex items-start justify-between gap-4 pt-3 border-t border-white/5">
              <div className="space-y-0.5">
                <span className="font-bold text-white block">Visual Palette Profile</span>
                <span className="text-slate-400 text-[11px]">Select your active workspace profile theme.</span>
              </div>
              
              <div className="flex items-center space-x-1 p-0.5 bg-slate-900 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                    theme === 'light' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Save button CTA */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:brightness-110 rounded-2xl text-white font-bold text-sm shadow-xl active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Save className="w-5 h-5 text-white" />
          <span>Save System Configurations</span>
        </button>

      </form>

    </div>
  );
}

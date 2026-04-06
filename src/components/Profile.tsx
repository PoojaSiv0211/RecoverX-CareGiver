/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronRight, 
  Users, 
  Globe, 
  HelpCircle,
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { CaregiverDashboard } from './CaregiverDashboard';
import { SettingsView } from './SettingsView';

interface ProfileProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const [showCaregiver, setShowCaregiver] = useState(false);
  const [activeSettingsView, setActiveSettingsView] = useState<'notifications' | 'privacy' | 'help' | null>(null);

  const handleLogout = () => {
    auth.signOut();
  };

  const handleLanguageChange = async () => {
    const langs: ('English' | 'Tamil' | 'Hindi' | 'Telugu')[] = ['English', 'Tamil', 'Hindi', 'Telugu'];
    const currentLang = user.language || 'English';
    const nextIdx = (langs.indexOf(currentLang) + 1) % langs.length;
    const newLang = langs[nextIdx];
    
    try {
      if (user.email !== 'poojasivaramalingam15@gmail.com') {
        await updateDoc(doc(db, 'users', user.uid), { language: newLang });
      }
      setUser({ ...user, language: newLang });
    } catch (error) {
      console.error("Failed to update language:", error);
    }
  };

  const toggleRole = async () => {
    const newRole = user.role === 'patient' ? 'caregiver' : 'patient';
    try {
      if (user.email !== 'poojasivaramalingam15@gmail.com') {
        await updateDoc(doc(db, 'users', user.uid), { role: newRole });
      }
      setUser({ ...user, role: newRole });
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  if (showCaregiver) {
    return <CaregiverDashboard user={user} onBack={() => setShowCaregiver(false)} />;
  }

  if (activeSettingsView) {
    return <SettingsView type={activeSettingsView} onBack={() => setActiveSettingsView(null)} />;
  }

  const menuItems = [
    { id: 'notifications', icon: Bell, label: 'Notifications', value: '4 New' },
    { id: 'language', icon: Globe, label: 'Language', value: user.language || 'English' },
    { id: 'caregiver', icon: Users, label: 'Caregiver Access', value: 'Manage' },
    { id: 'privacy', icon: Shield, label: 'Privacy & Security', value: '' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', value: '' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Profile</h2>
        <button className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 shadow-lg">
            <img src={user.photoURL || 'https://picsum.photos/seed/user/200'} alt={user.displayName} className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg border-4 border-white">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900">{user.displayName}</h3>
          <p className="text-sm text-slate-400 font-medium">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {user.role}
          </span>
          <button 
            onClick={toggleRole}
            className="bg-slate-50 text-slate-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-slate-100"
          >
            Switch Role
          </button>
        </div>
      </div>

      {/* Role-specific Actions */}
      {user.role === 'caregiver' && (
        <button 
          onClick={() => setShowCaregiver(true)}
          className="w-full bg-emerald-600 text-white p-6 rounded-[2rem] flex items-center justify-between shadow-xl shadow-emerald-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold">Caregiver Dashboard</p>
              <p className="text-xs opacity-60">Monitor patient adherence</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 opacity-40" />
        </button>
      )}

      {/* Menu List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'caregiver') setShowCaregiver(true);
                if (item.id === 'language') {
                  handleLanguageChange();
                }
                if (item.id === 'notifications' || item.id === 'privacy' || item.id === 'help') {
                  setActiveSettingsView(item.id as any);
                }
              }}
              className={`w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                idx !== menuItems.length - 1 ? 'border-b border-slate-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-slate-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && <span className="text-xs text-slate-400 font-bold">{item.value}</span>}
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-100 transition-all active:scale-95"
      >
        <LogOut className="w-6 h-6" />
        Sign Out
      </button>

      <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
        RecoverX - Caregiver v1.0.0 • AI-Powered
      </p>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Bell, 
  Shield, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Mail,
  Phone,
  MessageSquare,
  Lock,
  Eye,
  Key
} from 'lucide-react';

interface SettingsViewProps {
  type: 'notifications' | 'privacy' | 'help';
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ type, onBack }) => {
  const renderNotifications = () => (
    <div className="space-y-4">
      {[
        { title: 'Time for Medicine', desc: 'Amoxicillin 500mg is due now', time: '2 mins ago', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Streak Milestone!', desc: 'You reached a 14-day streak!', time: '2 hours ago', icon: CheckCircle2, color: 'text-orange-500', bg: 'bg-orange-50' },
        { title: 'New Report Ready', desc: 'Your weekly progress report is available', time: '5 hours ago', icon: Bell, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { title: 'Missed Exercise', desc: 'You missed your morning wall squats', time: '1 day ago', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
      ].map((n, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${n.bg} flex items-center justify-center ${n.color}`}>
            <n.icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900">{n.title}</p>
            <p className="text-xs text-slate-500">{n.desc}</p>
          </div>
          <span className="text-[10px] text-slate-300 font-bold uppercase">{n.time}</span>
        </div>
      ))}
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
        <div className="flex items-center gap-3 text-blue-600">
          <Lock className="w-6 h-6" />
          <h3 className="font-bold text-lg">Data Encryption</h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          All your health data, including prescriptions and pain logs, are encrypted end-to-end. Only you and your authorized caregivers can access this information.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
        <div className="flex items-center gap-3 text-emerald-600">
          <Eye className="w-6 h-6" />
          <h3 className="font-bold text-lg">Privacy Controls</h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          You have full control over who sees your data. You can revoke caregiver access at any time from the Caregiver Access menu.
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
        <div className="flex items-center gap-3 text-orange-600">
          <Key className="w-6 h-6" />
          <h3 className="font-bold text-lg">Account Security</h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          We use Google Authentication to ensure your account is protected by industry-standard security protocols.
        </p>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-blue-100">
        <h3 className="text-2xl font-black">How can we help?</h3>
        <p className="text-blue-100 text-sm">Our support team is available 24/7 to assist you with your recovery journey.</p>
        <div className="flex gap-2">
          <button className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
            <Mail className="w-5 h-5" />
          </button>
          <button className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
            <Phone className="w-5 h-5" />
          </button>
          <button className="bg-white/20 backdrop-blur-md p-3 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-bold text-slate-900 px-2">Frequently Asked Questions</h4>
        <div className="space-y-3">
          {[
            "How do I upload a prescription?",
            "Can I add multiple caregivers?",
            "How is my recovery score calculated?",
            "What happens if I miss a dose?"
          ].map((q, i) => (
            <button key={i} className="w-full bg-white p-5 rounded-2xl border border-slate-100 text-left flex justify-between items-center group">
              <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{q}</span>
              <ArrowLeft className="w-4 h-4 text-slate-300 rotate-180" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const titles = {
    notifications: 'Notifications',
    privacy: 'Privacy & Security',
    help: 'Help & Support'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-slate-900">{titles[type]}</h2>
      </div>

      {type === 'notifications' && renderNotifications()}
      {type === 'privacy' && renderPrivacy()}
      {type === 'help' && renderHelp()}
    </motion.div>
  );
};

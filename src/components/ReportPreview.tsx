/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  CheckCircle2, 
  TrendingUp, 
  Flame, 
  Activity,
  FileText,
  Calendar,
  Award,
  ChevronRight
} from 'lucide-react';
import { UserProfile, Task, PainLog } from '../types';
import { format, subDays } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ReportPreviewProps {
  user: UserProfile;
  tasks: Task[];
  painLogs: PainLog[];
  onBack: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ user, tasks, painLogs, onBack }) => {
  const today = new Date();
  const weekRange = `${format(subDays(today, 7), 'MMM d')} - ${format(today, 'MMM d, yyyy')}`;
  
  const adherenceData = [
    { day: 'Mon', score: 85 },
    { day: 'Tue', score: 90 },
    { day: 'Wed', score: 75 },
    { day: 'Thu', score: 95 },
    { day: 'Fri', score: 88 },
    { day: 'Sat', score: 92 },
    { day: 'Sun', score: user.recoveryScore },
  ];

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto pb-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg font-bold">Weekly Report</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{weekRange}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                // Simple download simulation
                const element = document.createElement("a");
                const file = new Blob(["RecoverX Weekly Report for " + user.displayName + "\nScore: " + user.recoveryScore], {type: 'text/plain'});
                element.href = URL.createObjectURL(file);
                element.download = "RecoverX_Report.txt";
                document.body.appendChild(element);
                element.click();
              }}
              className="p-2 rounded-xl bg-blue-600 text-white flex items-center gap-2 px-4"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm font-bold">Download</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Summary Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Recovery Master</h3>
                <p className="text-slate-500 font-medium">You've completed 92% of your goals this week!</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
              <div className="text-center space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Streak</p>
                <p className="text-xl font-black text-orange-500">{user.streak}</p>
              </div>
              <div className="text-center space-y-1 border-x border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Score</p>
                <p className="text-xl font-black text-blue-600">{user.recoveryScore}</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tasks</p>
                <p className="text-xl font-black text-emerald-500">42/45</p>
              </div>
            </div>
          </motion.div>

          {/* Charts Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 px-2">Adherence Trends</h3>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adherenceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {adherenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 6 ? '#3b82f6' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pain Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 px-2">Pain Analysis</h3>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Intensity Trend</p>
                  <p className="text-xs text-slate-400 font-medium">Decreased by 40% since Monday</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "Your pain levels show a steady decline, particularly after morning exercise sessions. This suggests the current rehab plan is highly effective for your right knee."
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Log */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 px-2">Weekly Milestones</h3>
            <div className="space-y-3">
              {[
                { label: 'Perfect Day', date: 'Oct 12', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Intensity Low', date: 'Oct 14', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'Streak Milestone', date: 'Oct 15', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
              ].map((m, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${m.bg} flex items-center justify-center ${m.color}`}>
                    <m.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{m.label}</p>
                    <p className="text-xs text-slate-400 font-medium">{m.date}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Branding */}
          <div className="text-center pt-10 space-y-2">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Activity className="w-5 h-5" />
              <span className="font-black tracking-tighter text-xl">RecoverX</span>
            </div>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">Official Recovery Report</p>
          </div>
        </div>
      </div>
    </div>
  );
};

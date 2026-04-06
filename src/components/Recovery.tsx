/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Activity, 
  Flame, 
  Calendar, 
  ChevronRight, 
  AlertCircle,
  FileText,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import { UserProfile, Task, PainLog } from '../types';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format, subDays } from 'date-fns';
import { PainHeatmap } from './PainHeatmap';
import { ReportPreview } from './ReportPreview';
import { getDemoPainLogs } from '../lib/mockData';

interface RecoveryProps {
  user: UserProfile;
}

export const Recovery: React.FC<RecoveryProps> = ({ user }) => {
  const [painLogs, setPainLogs] = useState<PainLog[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    if (user.email === 'poojasivaramalingam15@gmail.com') {
      setPainLogs(getDemoPainLogs(user.uid));
      return;
    }

    const q = query(
      collection(db, 'painLogs'),
      where('patientUid', '==', user.uid),
      orderBy('date', 'desc'),
      limit(7)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PainLog));
      setPainLogs(logs.reverse());
    });

    return () => unsubscribe();
  }, [user.uid, user.email]);

  const chartData = painLogs.map(log => ({
    date: format(new Date(log.date), 'MMM d'),
    intensity: log.intensity
  }));

  if (showHeatmap) {
    return <PainHeatmap user={user} onBack={() => setShowHeatmap(false)} />;
  }

  if (showReport) {
    return <ReportPreview user={user} tasks={[]} painLogs={painLogs} onBack={() => setShowReport(false)} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Recovery Insights</h2>
        <button className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400">
          <FileText className="w-5 h-5" />
        </button>
      </div>

      {/* Recovery Score Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-2xl" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin-slow" />
            <span className="text-4xl font-black">{user.recoveryScore}%</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Overall Recovery</h3>
            <p className="text-blue-100 text-sm font-medium">You're doing better than 85% of patients!</p>
          </div>
          <div className="flex gap-4 pt-2">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold">{user.streak} Day Streak</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold">On Track</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pain Intensity Chart */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Pain Intensity</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Last 7 Days</p>
          </div>
          <button 
            onClick={() => setShowHeatmap(true)}
            className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-full"
          >
            Log Pain
          </button>
        </div>

        <div className="h-48 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                />
                <YAxis 
                  hide 
                  domain={[0, 10]} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="intensity" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIntensity)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 font-medium italic">
              No pain data logged yet.
            </div>
          )}
        </div>
      </div>

      {/* Recovery Benchmarks */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Comparative Insights</h3>
        <div className="space-y-3">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 text-sm">Adherence Benchmark</p>
              <p className="text-xs text-slate-400 font-medium">You are 15% more consistent than average.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <PieChart className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 text-sm">Exercise Efficiency</p>
              <p className="text-xs text-slate-400 font-medium">Your morning sessions have the highest impact.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Report Card */}
      <button 
        onClick={() => setShowReport(true)}
        className="w-full bg-slate-900 text-white p-6 rounded-[2rem] flex items-center justify-between shadow-xl shadow-slate-200 active:scale-95 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-bold">Weekly Report Card</p>
            <p className="text-xs opacity-60">Ready for download</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 opacity-40" />
      </button>
    </div>
  );
};

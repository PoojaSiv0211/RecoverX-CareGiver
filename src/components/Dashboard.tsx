/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  TrendingUp, 
  Flame, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Activity
} from 'lucide-react';
import { UserProfile, Task } from '../types';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { format } from 'date-fns';
import { PrescriptionUpload } from './PrescriptionUpload';
import { PainHeatmap } from './PainHeatmap';
import { ReportPreview } from './ReportPreview';
import { getDemoTasks } from '../lib/mockData';
import { useTranslation } from '../lib/i18n';

interface DashboardProps {
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [showPainMap, setShowPainMap] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const { t } = useTranslation(user.language);

  useEffect(() => {
  if (!user) return;

  if (user.email === 'poojasivaramalingam15@gmail.com') {
    setTasks(getDemoTasks(user.uid));
    return;
  }

  const q = query(
    collection(db, 'tasks'),
    where('patientUid', '==', user.uid),
    orderBy('scheduledTime', 'asc'),
    limit(5)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const taskData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];

    setTasks(taskData);
  });

  return () => unsubscribe();
}, [user.uid, user.email]);
  if (showUpload) {
    return <PrescriptionUpload user={user} onBack={() => setShowUpload(false)} />;
  }

  if (showPainMap) {
    return <PainHeatmap user={user} onBack={() => setShowPainMap(false)} />;
  }

  if (showReports) {
    return <ReportPreview user={user} tasks={tasks} painLogs={[]} onBack={() => setShowReports(false)} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t('hello')}, {user.displayName.split(' ')[0]}!</h2>
          <p className="text-slate-500 font-medium">{user.streak} {t('days')} {t('streak')}. Keep it up!</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t('streak')}</p>
          <p className="text-2xl font-black text-slate-900">{user.streak} {t('days')}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{t('recovery_score')}</p>
          <p className="text-2xl font-black text-slate-900">{user.recoveryScore}%</p>
        </div>
      </div>

      {/* Primary Action - Always Visible */}
      <button 
        onClick={() => setShowUpload(true)}
        className="w-full bg-blue-600 p-6 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-blue-100 active:scale-95 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">{t('upload_prescription')}</p>
            <p className="text-xs opacity-80">AI-powered rehab plan generation</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 opacity-40" />
      </button>

      {/* Today's Tasks */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">{t('today_schedule')}</h3>
          <button className="text-blue-600 text-sm font-bold flex items-center gap-1">
            {t('view_all')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">{t('no_tasks')}</p>
            </div>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  task.completed ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{task.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{format(new Date(task.scheduledTime), 'h:mm a')}</p>
                </div>
                {!task.completed && (
                  <button className="bg-slate-50 text-slate-400 p-2 rounded-lg hover:text-blue-600 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">{t('quick_actions')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setShowPainMap(true)}
            className="bg-indigo-600 p-4 rounded-3xl text-white space-y-2 text-left shadow-lg shadow-indigo-100 active:scale-95 transition-all"
          >
            <Activity className="w-6 h-6" />
            <p className="font-bold">{t('pain_map')}</p>
            <p className="text-[10px] opacity-80 uppercase font-bold tracking-wider">{t('log_intensity')}</p>
          </button>
          <button 
            onClick={() => setShowReports(true)}
            className="bg-emerald-600 p-4 rounded-3xl text-white space-y-2 text-left shadow-lg shadow-emerald-100 active:scale-95 transition-all"
          >
            <FileText className="w-6 h-6" />
            <p className="font-bold">{t('reports')}</p>
            <p className="text-[10px] opacity-80 uppercase font-bold tracking-wider">{t('view_progress')}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

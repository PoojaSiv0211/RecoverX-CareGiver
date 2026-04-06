/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Search, 
  Filter, 
  Pill, 
  Activity,
  Loader2
} from 'lucide-react';
import { UserProfile, Task } from '../types';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { Verification } from './Verification';
import { getDemoTasks } from '../lib/mockData';

interface TasksProps {
  user: UserProfile;
}

export const Tasks: React.FC<TasksProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'medicine' | 'exercise'>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (user.email === 'poojasivaramalingam15@gmail.com') {
      setTasks(getDemoTasks(user.uid));
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('patientUid', '==', user.uid),
      orderBy('scheduledTime', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(taskData);
    });

    return () => unsubscribe();
  }, [user.uid, user.email]);

  const filteredTasks = tasks.filter(t => filter === 'all' || t.type === filter);

  const groupTasksByDate = (tasks: Task[]) => {
    const groups: { [key: string]: Task[] } = {};
    tasks.forEach(task => {
      const date = new Date(task.scheduledTime);
      let label = format(date, 'EEEE, MMM d');
      if (isToday(date)) label = 'Today';
      else if (isTomorrow(date)) label = 'Tomorrow';
      else if (isPast(date) && !isToday(date)) label = 'Past Due';

      if (!groups[label]) groups[label] = [];
      groups[label].push(task);
    });
    return groups;
  };

  const groupedTasks = groupTasksByDate(filteredTasks);

  if (selectedTask) {
    return <Verification task={selectedTask} user={user} onBack={() => setSelectedTask(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Your Schedule</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
        {['all', 'medicine', 'exercise'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-8">
        {Object.entries(groupedTasks).map(([label, tasks]) => (
          <div key={label} className="space-y-4">
            <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${
              label === 'Past Due' ? 'text-red-500' : 'text-slate-400'
            }`}>
              {label}
            </h3>
            <div className="space-y-3">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layoutId={task.id}
                  onClick={() => {
  if (!task.completed) {
    setSelectedTask(task);
  }
}}
                  className={`bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all ${
                    task.completed ? 'opacity-60 grayscale' : 'active:scale-95 cursor-pointer'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    task.completed ? 'bg-green-50 text-green-500' : 
                    task.type === 'medicine' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {task.completed ? <CheckCircle2 className="w-6 h-6" /> : 
                     task.type === 'medicine' ? <Pill className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{task.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <Clock className="w-3 h-3" />
                      {format(new Date(task.scheduledTime), 'h:mm a')}
                    </div>
                  </div>
                  {!task.completed && (
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Start
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-medium">No tasks found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

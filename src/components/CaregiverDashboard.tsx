/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Patient, Task } from '../types';
import { 
  Heart, 
  Activity, 
  Brain, 
  AlertOctagon, 
  CheckCircle, 
  Clock, 
  Edit, 
  RotateCw, 
  Calendar as CalendarIcon, 
  Plus, 
  TrendingUp, 
  Briefcase, 
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Bell,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface CaregiverDashboardProps {
  patients: Patient[];
  onUpdatePatient: (updatedPatient: Patient) => void;
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
  isDark?: boolean;
}

export default function CaregiverDashboard({ 
  patients, 
  onUpdatePatient, 
  selectedPatientId, 
  onSelectPatient,
  isDark = true
}: CaregiverDashboardProps) {
  
  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  
  // Local states
  const [aiInsights, setAiInsights] = useState<{
    status: string;
    summary: string;
    recommendations: string[];
    exerciseAdvice: string;
  } | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [notesText, setNotesText] = useState(currentPatient.notes);
  const [newTaskText, setNewTaskText] = useState('');
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotChat, setCopilotChat] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: `Hello! I am your RecoverX AI Copilot. How can I assist with ${currentPatient.name}'s daily homecare guidelines or clinical routines today?` }
  ]);
  const [loadingChat, setLoadingChat] = useState(false);

  // Synchronize notes text when patient shifts
  useEffect(() => {
    setNotesText(currentPatient.notes);
    // Fetch initial AI insights for the current patient if not loaded
    fetchInsights();
    // Reset copilot welcome message
    setCopilotChat([
      { role: 'assistant', content: `Hello! I am your RecoverX AI Copilot. How can I assist with ${currentPatient.name}'s daily rehabilitation routines, medication reminders, or pain indicators?` }
    ]);
  }, [selectedPatientId]);

  // Call backend to generate AI insights
  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: currentPatient.name,
          recoveryScore: currentPatient.recoveryScore,
          heartRate: currentPatient.heartRate,
          painScore: currentPatient.painScore,
          adherence: currentPatient.adherence,
          notes: notesText
        })
      });
      const data = await response.json();
      setAiInsights(data);
    } catch (error) {
      console.error("Error fetching patient insights:", error);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Call backend to ask Copilot
  const askCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;

    const userMsg = copilotQuery;
    const newChatHistory = [...copilotChat, { role: 'user' as const, content: userMsg }];
    setCopilotChat(newChatHistory);
    setCopilotQuery('');
    setLoadingChat(true);

    try {
      const response = await fetch('/api/copilot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newChatHistory,
          patientDetails: {
            name: currentPatient.name,
            age: currentPatient.age,
            gender: currentPatient.gender,
            injury: currentPatient.injury,
            recoveryScore: currentPatient.recoveryScore,
            medications: currentPatient.medications.map(m => m.name).join(', '),
            painScore: currentPatient.painScore,
            adherence: currentPatient.adherence
          }
        })
      });
      const data = await response.json();
      setCopilotChat(prev => [...prev, data.message]);
    } catch (error) {
      console.error("Error talking to Copilot:", error);
      setCopilotChat(prev => [...prev, { 
        role: 'assistant', 
        content: "I had trouble matching the clinical record. Please ensure the server is online and try asking again." 
      }]);
    } finally {
      setLoadingChat(false);
    }
  };

  // Toggle checklist tasks
  const handleToggleTask = (taskId: string) => {
    const updatedChecklist = currentPatient.dailyChecklist.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    
    // Recalculate adherence rate briefly based on compliance
    const total = updatedChecklist.length;
    const completedCount = updatedChecklist.filter(t => t.completed).length;
    const baseAdherence = Math.round((completedCount / total) * 100);
    
    const updatedPatient: Patient = {
      ...currentPatient,
      dailyChecklist: updatedChecklist,
      adherence: total > 0 ? baseAdherence : currentPatient.adherence
    };
    onUpdatePatient(updatedPatient);
  };

  // Save caregiver notes
  const handleSaveNotes = () => {
    const updatedPatient: Patient = {
      ...currentPatient,
      notes: notesText
    };
    onUpdatePatient(updatedPatient);
    fetchInsights(); // Regenerate insights with new notes context!
  };

  // Add custom caregiver task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      text: newTaskText,
      completed: false,
      time: 'As Needed',
      category: 'checkup'
    };

    const updatedPatient: Patient = {
      ...currentPatient,
      dailyChecklist: [...currentPatient.dailyChecklist, newTask]
    };
    onUpdatePatient(updatedPatient);
    setNewTaskText('');
  };

  // Toggle Medication as Taken
  const handleToggleMed = (medId: string) => {
    const updatedMeds = currentPatient.medications.map(m => {
      if (m.id === medId) {
        return { ...m, taken: !m.taken };
      }
      return m;
    });

    const updatedPatient: Patient = {
      ...currentPatient,
      medications: updatedMeds
    };
    onUpdatePatient(updatedPatient);
  };

  // Custom colors for recovery status
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Critical':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'Needs Attention':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default:
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 max-w-[1600px] mx-auto w-full">
      
      {/* Patient Selection Left Panel (Col span 1 of 3, 1 of 4) */}
      <div className="lg:col-span-1 xl:col-span-1 space-y-6 min-w-0">
        
        {/* Outpatients header */}
        <div className={`${isDark ? 'glass text-white' : 'bg-white border border-slate-100 shadow-sm text-slate-900'} p-4 rounded-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-display font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Active Outpatients</h3>
            <span className={`px-2.5 py-0.5 rounded-full ${isDark ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-100'} font-mono text-xs`}>
              {patients.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {patients.map(p => {
              const isSelected = p.id === selectedPatientId;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPatient(p.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? isDark 
                        ? 'bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border-indigo-500/40 shadow-md shadow-blue-500/5 text-white font-semibold' 
                        : 'bg-blue-50 border-blue-300 shadow-sm text-slate-900 font-bold'
                      : isDark 
                        ? 'border-white/5 hover:border-white/10 hover:bg-white/5 text-slate-200' 
                        : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`font-semibold text-xs ${isSelected && !isDark ? 'text-blue-800' : isDark ? 'text-white' : 'text-slate-900'} font-display`}>{p.name}</span>
                    <span className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{p.age} y/o, {p.gender[0]}</span>
                  </div>
                  <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'} block truncate mb-3`}>
                    {p.injury}
                  </span>
                  
                  {/* Miniature progress indicator */}
                  <div className={`flex items-center justify-between text-xs ${isDark ? 'text-indigo-300' : 'text-blue-700'} font-mono font-bold mb-1`}>
                    <span>Recovery Index</span>
                    <span>{p.recoveryScore}%</span>
                  </div>
                  <div className={`w-full h-1.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                      style={{ width: `${p.recoveryScore}%` }} 
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency Alert Hotline Summary Panel */}
        <div className={`p-4 rounded-2xl border text-xs ${isDark ? 'bg-rose-950/20 border-rose-500/30' : 'bg-rose-50/70 border-rose-200 shadow-sm'} space-y-2`}>
          <div className={`flex items-center space-x-2 font-bold font-display ${isDark ? 'text-rose-400' : 'text-rose-755 font-extrabold'}`}>
            <AlertOctagon className="w-5 h-5 shrink-0" />
            <span className="text-sm">Emergency Clinician Panel</span>
          </div>
          <p className={`${isDark ? 'text-slate-200' : 'text-slate-800'} leading-relaxed text-xs font-medium`}>
            In case of urgent post-op issues (e.g. unilateral swelling, unmanaged 9/10 pain, or high fever), contact the orthopedic on-call pager.
          </p>
          <div className={`mt-3.5 pt-3 border-t ${isDark ? 'border-rose-500/20' : 'border-rose-200'} flex justify-between items-center text-xs font-mono`}>
            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>MD On-Call:</span>
            <span className={`font-bold underline ${isDark ? 'text-white' : 'text-slate-900'}`}>+1 (555) 019-2834</span>
          </div>
        </div>

      </div>

      {/* Main Caregiver Cockpit (Col span 2 of 3, 3 of 4) - space-y-6 corresponds to 24px spacing */}
      <div className="lg:col-span-2 xl:col-span-3 space-y-6 min-w-0">
        
        {/* 1. Patient Overview */}
        <div className={`${isDark ? 'glass' : 'bg-white border border-slate-100 shadow-sm'} p-5 rounded-2xl relative overflow-hidden`}>
          {/* Accent light background blobs */}
          {isDark ? (
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          ) : (
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
          )}
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded-full ${isDark ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'} text-xs font-mono border`}>
                  REHABILITATION MONITORING
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'} font-mono font-semibold`}>ID: {currentPatient.id}</span>
              </div>
              <h2 className={`font-display font-extrabold text-2xl ${isDark ? 'text-white' : 'text-slate-900'} mt-2 flex items-center gap-2`}>
                <span>{currentPatient.name}</span>
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} text-sm`}>({currentPatient.age} y/o {currentPatient.gender})</span>
              </h2>
              <p className={`text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'} font-semibold mt-1`}>{currentPatient.injury}</p>
            </div>
          </div>
        </div>

        {/* 2. Recovery Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'} p-4 rounded-2xl flex items-center space-x-3 min-h-[84px]`}>
            <div className={`p-2.5 rounded-xl ${isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600 border border-rose-250'} shrink-0`}>
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700 font-semibold'} block font-mono`}>Heart Rate</span>
              <span className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} font-mono`}>{currentPatient.heartRate} BPM</span>
            </div>
          </div>

          <div className={`${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'} p-4 rounded-2xl flex items-center space-x-3 min-h-[84px]`}>
            <div className={`p-2.5 rounded-xl ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600 border border-amber-250'} shrink-0`}>
              <Heart className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700 font-semibold'} block font-mono`}>Pain Index</span>
              <span className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} font-mono`}>{currentPatient.painScore} / 10</span>
            </div>
          </div>

          <div className={`${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'} p-4 rounded-2xl flex items-center space-x-3 min-h-[84px]`}>
            <div className={`p-2.5 rounded-xl ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-250'} shrink-0`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700 font-semibold'} block font-mono`}>PT Adherence</span>
              <span className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} font-mono`}>{currentPatient.adherence}%</span>
            </div>
          </div>
        </div>

        {/* 3. AI Care Insights */}
        <div className={`${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'} p-5 rounded-2xl relative overflow-hidden`}>
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b ${isDark ? 'border-white/10' : 'border-slate-200'} pb-4 mb-4 gap-4`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-display font-extrabold text-base ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  <span>Gemini AI Care Insights</span>
                  <span className={`text-xs uppercase tracking-wider font-mono px-2 py-0.5 rounded-full ${isDark ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    Live Analyzer
                  </span>
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-300 font-medium' : 'text-slate-700 font-medium'} mt-0.5`}>Dynamic clinical analytics matching live treatment telemetry</p>
              </div>
            </div>

            <button 
              onClick={fetchInsights}
              disabled={loadingInsights}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-xl font-semibold text-xs text-white flex items-center space-x-1.5 transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loadingInsights ? 'animate-spin' : ''}`} />
              <span>{loadingInsights ? 'Analyzing telemetry...' : 'Analyze Vitals'}</span>
            </button>
          </div>

          {loadingInsights ? (
            <div className={`py-8 flex flex-col items-center justify-center space-y-3 ${isDark ? 'text-slate-300 font-medium' : 'text-slate-800 font-semibold'} text-xs`}>
              <div className={`w-8 h-8 rounded-full border-2 border-t-blue-600 ${isDark ? 'border-white/20' : 'border-slate-300'} animate-spin`} />
              <span>Invoking Gemini Clinical Decision Support Models...</span>
            </div>
          ) : aiInsights ? (
            <div className="space-y-4 text-xs">
              
              {/* Status priority badge & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-3">
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-750'} block uppercase font-bold`}>Care Status</span>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-xl border font-extrabold ${getStatusColor(aiInsights.status)}`}>
                    {aiInsights.status}
                  </span>
                </div>
                <div className="md:col-span-9">
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-750'} block uppercase font-bold`}>Rehab Summary</span>
                  <p className={`${isDark ? 'text-slate-100' : 'text-slate-900'} leading-relaxed font-sans mt-1.5 text-xs font-medium`}>
                    {aiInsights.summary}
                  </p>
                </div>
              </div>

              {/* Actionable items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200 shadow-sm'}`}>
                  <span className={`text-xs font-mono ${isDark ? 'text-indigo-300' : 'text-blue-700'} block uppercase font-extrabold tracking-wider mb-2`}>
                    Actionable Recommendations
                  </span>
                  <ul className={`space-y-2 ${isDark ? 'text-slate-100' : 'text-slate-900'} list-disc pl-4 leading-relaxed font-sans text-xs font-medium`}>
                    {aiInsights.recommendations?.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-slate-50 border border-slate-200 shadow-sm'}`}>
                  <span className={`text-xs font-mono ${isDark ? 'text-indigo-300' : 'text-blue-700'} block uppercase font-extrabold tracking-wider mb-2`}>
                    Physical Rehabilitation Advice
                  </span>
                  <p className={`${isDark ? 'text-slate-100' : 'text-slate-900'} leading-relaxed font-sans italic text-xs font-semibold`}>
                    {aiInsights.exerciseAdvice}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className={`text-center py-6 ${isDark ? 'text-slate-300' : 'text-slate-750'} text-xs italic font-semibold`}>
              No insights analyzed yet. Click "Analyze Vitals" to review orthostatic compliance.
            </div>
          )}
        </div>

        {/* 4. Charts */}
        <div className={`${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'} p-5 rounded-2xl flex flex-col h-[340px]`}>
          <div className="flex justify-between items-center mb-1">
            <h3 className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
              <TrendingUp className="w-4.5 h-4.5 text-blue-500" />
              <span>Weekly Recovery Index Trend</span>
            </h3>
            <span className={`px-2 py-0.5 rounded ${isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-blue-50 text-blue-700 border border-blue-100'} font-mono text-[10px]`}>Recharts Graph</span>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-300 font-medium' : 'text-slate-705 font-medium'} mb-4`}>Patient rehabilitation success indexes across the past 7 daily segments.</p>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentPatient.analytics} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRecovery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} opacity={isDark ? 0.3 : 0.8} />
                <XAxis dataKey="day" stroke={isDark ? "#cbd5e1" : "#334155"} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? "#cbd5e1" : "#334155"} fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                    borderColor: isDark ? '#334155' : '#cbd5e1', 
                    borderRadius: 8,
                    color: isDark ? '#ffffff' : '#0f172a',
                    fontSize: 12
                  }}
                  labelStyle={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="recovery" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRecovery)" name="Recovery Score (%)" />
                <Area type="monotone" dataKey="pain" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorPain)" name="Pain Level (x10)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Weekly Clinical Summary (Treatment Plan & Medication Protocol) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Today's Rehab Tasks & Daily Checklist */}
          <div className={`${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'} p-5 rounded-2xl flex flex-col min-h-[360px]`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                <CheckCircle className="w-4.5 h-4.5 text-blue-500" />
                <span>Today's Treatment Plan</span>
              </h3>
              <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'} font-mono font-semibold`}>Check tasks taken</span>
            </div>

            {/* Checklist List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 mb-4 max-h-[220px]">
              {currentPatient.dailyChecklist.map(task => (
                <div 
                  key={task.id} 
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                    task.completed 
                      ? isDark
                        ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-200 line-through' 
                        : 'bg-emerald-50/70 border-emerald-200 text-slate-600 line-through'
                      : isDark
                        ? 'bg-white/5 border-white/10 text-white hover:border-white/20'
                        : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 text-xs">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => handleToggleTask(task.id)}
                      className={`w-4.5 h-4.5 rounded ${isDark ? 'border-white/20' : 'border-slate-300'} text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-500 shrink-0`}
                    />
                    <div>
                      <p className="font-semibold leading-tight text-xs">{task.text}</p>
                      <span className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-705'} flex items-center space-x-1 mt-1 font-medium`}>
                        <Clock className="w-3 h-3" />
                        <span>{task.time}</span>
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-mono font-bold tracking-wide shrink-0 ${
                    task.category === 'medication' ? (isDark ? 'bg-indigo-500/10 text-indigo-300' : 'bg-indigo-50 text-indigo-700 border border-indigo-200') :
                    task.category === 'exercise' ? (isDark ? 'bg-purple-500/10 text-purple-300' : 'bg-purple-50 text-purple-700 border border-purple-200') :
                    task.category === 'checkup' ? (isDark ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-50 text-amber-700 border border-amber-200') : (isDark ? 'bg-slate-500/10 text-slate-300' : 'bg-slate-100 text-slate-700 border border-slate-200')
                  }`}>
                    {task.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Custom Caregiver Task Form */}
            <form onSubmit={handleAddTask} className={`flex gap-2 border-t ${isDark ? 'border-white/10' : 'border-slate-200'} pt-4 mt-auto`}>
              <input 
                type="text"
                placeholder="Schedule custom nurse task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className={`flex-1 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'} rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500`}
              />
              <button 
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium text-xs text-white flex items-center justify-center cursor-pointer active:scale-95 transition-transform shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Card 2: Medication Reminders */}
          <div className={`${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'} p-5 rounded-2xl flex flex-col min-h-[360px]`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                <Briefcase className="w-4.5 h-4.5 text-blue-500" />
                <span>Medication Protocol</span>
              </h3>
              <span className={`text-xs ${isDark ? 'text-slate-300 font-semibold' : 'text-slate-705 font-bold'} font-mono`}>Prescribed dosages</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 max-h-[220px]">
              {currentPatient.medications.map(med => (
                <div 
                  key={med.id} 
                  className={`p-3.5 rounded-xl ${isDark ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-slate-50 border-slate-200 hover:border-slate-300'} border flex items-center justify-between transition-all`}
                >
                  <div className="text-xs">
                    <h4 className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-900'} text-xs`}>{med.name}</h4>
                    <p className={`${isDark ? 'text-slate-200' : 'text-slate-805'} mt-0.5 text-xs font-semibold`}>Dosage: {med.dosage} — <span className={`${isDark ? 'text-indigo-300' : 'text-blue-700'} font-bold`}>{med.timing}</span></p>
                    <span className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-650'} mt-1 block font-semibold`}>Frequency: {med.frequency}</span>
                  </div>
                  
                  <button
                    onClick={() => handleToggleMed(med.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs tracking-tight transition-colors cursor-pointer shrink-0 ${
                      med.taken 
                        ? isDark
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                  >
                    {med.taken ? 'Logged Taken' : 'Log Taken'}
                  </button>
                </div>
              ))}
            </div>

            {/* Note on medical changes */}
            <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-indigo-950/20 border-indigo-500/30 text-indigo-300 font-semibold' : 'bg-blue-50 border-blue-200 text-blue-800 font-bold'} text-xs leading-relaxed font-sans`}>
              Always inspect orthostatic parameters before giving blood pressure treatments. Any skipped doses must be reported to Dr. Gaurav Sen.
            </div>
          </div>

        </div>

        {/* 6. Copilot */}
        <div className={`p-5 rounded-2xl ${isDark ? 'bg-gradient-to-tr from-[#0d1326] to-[#121933] border-white/10' : 'bg-white border border-slate-200 shadow-sm'} border space-y-4`}>
          <div className="flex items-center space-x-2 text-blue-600">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            <h3 className={`font-display font-extrabold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>Interactive Copilot Consultation Sandbox</h3>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'} leading-relaxed font-sans font-medium`}>
            Consult the AI coach directly about custom clinical details, rehab rules, or wound inspections. The copilot uses context from the current patient profile.
          </p>

          {/* Chat Feed */}
          <div className={`h-48 overflow-y-auto pr-1 space-y-3.5 p-3.5 ${isDark ? 'bg-slate-950/30 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-xl border`}>
            {copilotChat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3.5 rounded-xl max-w-xl text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none font-semibold' 
                    : isDark
                      ? 'bg-white/10 text-white border-white/15 rounded-bl-none border font-semibold'
                      : 'bg-white text-slate-900 border-slate-300 rounded-bl-none border shadow-sm font-semibold'
                }`}>
                  <span className="block font-bold font-mono text-[10px] mb-1 opacity-80">
                    {msg.role === 'user' ? 'You (Caregiver)' : 'RecoverX AI Copilot'}
                  </span>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {loadingChat && (
              <div className="flex justify-start">
                <div className={`${isDark ? 'bg-white/10 border-white/15 text-slate-300 font-semibold' : 'bg-white border-slate-300 text-slate-900 font-semibold'} p-3 rounded-xl rounded-bl-none border text-xs flex items-center space-x-2`}>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                  <span>Consulting clinical modules...</span>
                </div>
              </div>
            )}
          </div>

          {/* Ask Input */}
          <form onSubmit={askCopilot} className="flex gap-3">
            <input 
              type="text"
              placeholder={`Ask about ${currentPatient.name}'s recovery (e.g. "What exercises are recommended for hip stiffening?")`}
              value={copilotQuery}
              onChange={(e) => setCopilotQuery(e.target.value)}
              className={`flex-1 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-600 font-semibold'} rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500`}
            />
            <button 
              type="submit"
              disabled={loadingChat || !copilotQuery.trim()}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-650 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 cursor-pointer transition-transform shrink-0"
            >
              <span>Consult Copilot</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>

        {/* 7. Care Notes */}
        <div className={`${isDark ? 'glass' : 'bg-white border border-slate-200 shadow-sm'} p-5 rounded-2xl flex flex-col`}>
          <h3 className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2 mb-1`}>
            <Edit className="w-4.5 h-4.5 text-blue-500" />
            <span>Caregiver's Shift Notes</span>
          </h3>
          <p className={`text-xs ${isDark ? 'text-slate-300 font-semibold' : 'text-slate-705 font-bold'} mb-3`}>These notes formulate direct context for clinical AI evaluations.</p>
          
          <textarea 
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Type physical stiffness notes, appetite changes, wound inspection records, or patient feedback..."
            className={`w-full min-h-[120px] ${isDark ? 'bg-white/5 border-white/15 text-white placeholder-slate-400 font-medium' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-600 font-semibold'} rounded-xl p-3.5 text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed`}
          />

          <button
            onClick={handleSaveNotes}
            className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            Save Notes & Sync Context
          </button>
        </div>

        {/* 8. Settings & Secure System Status Footer */}
        <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row justify-between items-center gap-3 ${isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800 font-semibold shadow-sm'} font-mono`}>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure System Status: Online (Encrypted Sync Active)</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>Theme: {isDark ? 'Dark Mode' : 'Light Mode'}</span>
            <span>•</span>
            <span>Caregiver: Lead Coordinator</span>
          </div>
        </div>

      </div>

    </div>
  );
}

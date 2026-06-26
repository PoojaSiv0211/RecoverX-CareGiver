/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Patient, NotificationItem } from '../types';
import { 
  Home, 
  Users, 
  Heart, 
  Calendar, 
  Bell, 
  Activity, 
  TrendingUp, 
  CheckCircle, 
  Wifi, 
  Battery, 
  ChevronRight, 
  Sparkles, 
  Search,
  Plus
} from 'lucide-react';

interface MobileSimulatorProps {
  patients: Patient[];
  notifications: NotificationItem[];
}

type MobileScreen = 'home' | 'patients' | 'status' | 'meds' | 'notifications';

export default function MobileSimulator({ patients, notifications }: MobileSimulatorProps) {
  const [activeScreen, setActiveScreen] = useState<MobileScreen>('home');
  const [selectedPatId, setSelectedPatId] = useState<string>(patients[0].id);
  const currentPatient = patients.find(p => p.id === selectedPatId) || patients[0];

  // Quick states within simulated mobile phone
  const [mobMeds, setMobMeds] = useState(
    currentPatient.medications.map(m => ({ ...m, taken: m.taken }))
  );

  // Sync mobile medicines list if patient switches
  React.useEffect(() => {
    setMobMeds(currentPatient.medications.map(m => ({ ...m, taken: m.taken })));
  }, [selectedPatId]);

  const toggleMobMed = (id: string) => {
    setMobMeds(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, taken: !m.taken };
      }
      return m;
    }));
  };

  const getSeverityBadge = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-500 text-white';
      case 'medication_alert':
        return 'bg-amber-500 text-slate-900';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-1 md:p-4 max-w-5xl mx-auto">
      
      {/* Informational Panel Left (Col span 5) */}
      <div className="lg:col-span-5 space-y-5 self-center">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-mono border border-indigo-500/20 uppercase tracking-wide">
            iOS Mobile Appulator
          </span>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white mt-2">
            RecoverX Companion
          </h2>
          <p className="text-sm text-slate-400">
            A premium mobile application designed for nurses, in-home caretakers, and ambulatory rehabilitation providers on iOS.
          </p>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-slate-300">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h4 className="font-bold text-white font-display mb-1">Seamless Synced Outpatient Node</h4>
            <p>Every medication log, daily checklist tick, or vitals change made in this mobile simulator synchronizes immediately across the central clinician terminal.</p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h4 className="font-bold text-white font-display mb-1">Interactive Touch UI Mockup</h4>
            <p>Tap the physical iPhone home buttons, patient lists, or footer tabs to navigate between the 5 premium caregiver screens seamlessly.</p>
          </div>
        </div>
      </div>

      {/* iPhone Device frame center (Col span 7) */}
      <div className="lg:col-span-7 flex justify-center">
        
        {/* Physical Smartphone shell */}
        <div className="relative w-[340px] h-[680px] bg-[#000] rounded-[48px] p-3.5 border-4 border-slate-700 shadow-2xl ring-12 ring-slate-900/40">
          
          {/* Speaker ear slit & Front notch camera */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50 flex justify-center items-center">
            <div className="w-10 h-1 bg-slate-800 rounded-full mb-1" />
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800 ml-2 mb-1" />
          </div>

          {/* Smartphone Screen Canvas */}
          <div className="w-full h-full bg-[#0a0f24] rounded-[36px] overflow-hidden flex flex-col relative font-sans text-slate-300 select-none">
            
            {/* iOS Top Bar */}
            <div className="h-10 pt-4 px-6 flex justify-between items-center text-[11px] font-semibold text-white/90 z-40 bg-gradient-to-b from-[#0a0f24]/80 to-transparent">
              <span>09:41</span>
              <div className="flex items-center space-x-1.5">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[9px] font-mono">5G</span>
                <Battery className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Simulated App Content Router */}
            <div className="flex-1 overflow-y-auto px-4 pt-1 pb-4">
              
              {/* Screen: HOME */}
              {activeScreen === 'home' && (
                <div className="space-y-4 pt-2">
                  {/* Greeting header */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">WELCOME BACK</span>
                      <h4 className="font-display font-extrabold text-base text-white">Priya Sharma, RN</h4>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow">
                      PS
                    </div>
                  </div>

                  {/* Active Care Patient Selector inline */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] uppercase tracking-wider font-mono text-indigo-100">Selected Case File</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-sm font-display">{currentPatient.name}</h5>
                        <p className="text-[10px] text-indigo-100 line-clamp-1">{currentPatient.injury}</p>
                      </div>
                      <span className="font-display font-extrabold text-2xl">{currentPatient.recoveryScore}%</span>
                    </div>
                    
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white" style={{ width: `${currentPatient.recoveryScore}%` }} />
                    </div>
                  </div>

                  {/* Vitals Summary Strip */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                      <span className="text-slate-400 text-[10px] block">Heart Rate</span>
                      <span className="font-bold text-white block mt-0.5 font-mono text-sm">{currentPatient.heartRate} BPM</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                      <span className="text-slate-400 text-[10px] block">Pain Level</span>
                      <span className="font-bold text-white block mt-0.5 font-mono text-sm">{currentPatient.painScore} / 10</span>
                    </div>
                  </div>

                  {/* Alerts Preview */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">Critical Care Alerts</span>
                      <span className="text-[10px] text-indigo-400 cursor-pointer" onClick={() => setActiveScreen('notifications')}>View all</span>
                    </div>
                    
                    {notifications.slice(0, 2).map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-rose-950/15 border border-rose-500/20 text-[11px] leading-relaxed flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <div>
                          <span className="font-bold text-rose-300 block">{n.title}</span>
                          <p className="text-slate-300">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Screen: PATIENTS */}
              {activeScreen === 'patients' && (
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-display font-extrabold text-base text-white">Patient Registry</h4>
                    <Plus className="w-4 h-4 text-indigo-400" />
                  </div>

                  {/* Search filter mockup */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search active patients..." 
                      className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs placeholder-slate-500 text-white focus:outline-none"
                    />
                  </div>

                  {/* Scrollable List */}
                  <div className="space-y-2.5">
                    {patients.map(p => {
                      const isSelected = p.id === selectedPatId;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPatId(p.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer text-xs ${
                            isSelected 
                              ? 'bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border-indigo-500/30 shadow' 
                              : 'border-white/5 bg-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white font-display text-sm">{p.name}</span>
                            <span className="text-[10px] font-mono text-indigo-400 font-bold">{p.recoveryScore}%</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal line-clamp-1">{p.injury}</p>
                          <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${p.recoveryScore}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Screen: STATUS (RECOVERY) */}
              {activeScreen === 'status' && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">REHAB TELEMETRY</span>
                    <h4 className="font-display font-extrabold text-base text-white">{currentPatient.name}</h4>
                  </div>

                  {/* Circular/Semi recovery score badge */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-2">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Recovery Compliance</span>
                    <div className="w-20 h-20 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 mx-auto flex items-center justify-center">
                      <span className="font-display font-extrabold text-lg text-white font-mono">{currentPatient.recoveryScore}%</span>
                    </div>
                    <p className="text-[10px] text-slate-300 italic">Progressing smoothly over critical 14-day orthopedic milestones.</p>
                  </div>

                  {/* Vitals breakdown */}
                  <div className="space-y-2">
                    <span className="font-bold text-white text-xs block">Active Vitals Sensors</span>
                    
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
                        <span className="font-medium">Cardiac Telemetry</span>
                      </div>
                      <span className="font-mono font-bold text-white">{currentPatient.heartRate} BPM</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-amber-400" />
                        <span className="font-medium">Wound Pain Scale</span>
                      </div>
                      <span className="font-mono font-bold text-white">{currentPatient.painScore} / 10</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="font-medium">Protocol Compliance</span>
                      </div>
                      <span className="font-mono font-bold text-white">{currentPatient.adherence}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Screen: MEDS (REMINDERS) */}
              {activeScreen === 'meds' && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">DAILY REMINDERS</span>
                    <h4 className="font-display font-extrabold text-base text-white">Medication Log</h4>
                  </div>

                  <p className="text-[11px] text-slate-400">Select logged dosages once administered for medical compliance sync.</p>

                  <div className="space-y-2.5">
                    {mobMeds.map(med => (
                      <div 
                        key={med.id}
                        onClick={() => toggleMobMed(med.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                          med.taken 
                            ? 'bg-emerald-950/15 border-emerald-500/20 text-slate-300' 
                            : 'bg-white/5 border-white/5 text-white'
                        }`}
                      >
                        <div>
                          <h5 className={`font-bold ${med.taken ? 'line-through text-slate-400' : ''}`}>{med.name}</h5>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{med.dosage} • {med.timing}</span>
                        </div>
                        <input 
                          type="checkbox"
                          checked={med.taken}
                          onChange={() => {}} // Swallowed: handeled by clicking outer div
                          className="w-4 h-4 rounded border-white/10 text-indigo-500 cursor-pointer accent-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Screen: NOTIFICATIONS */}
              {activeScreen === 'notifications' && (
                <div className="space-y-4 pt-2">
                  <h4 className="font-display font-extrabold text-base text-white">Alert Center</h4>

                  <div className="space-y-2.5">
                    {notifications.map(n => (
                      <div 
                        key={n.id}
                        className={`p-3 rounded-xl border flex items-start space-x-2.5 text-xs bg-white/5 border-white/5`}
                      >
                        <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${n.read ? 'bg-slate-600' : 'bg-indigo-500 animate-pulse'}`} />
                        <div>
                          <span className="font-bold text-white block leading-tight">{n.title}</span>
                          <p className="text-[10.5px] text-slate-300 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 font-mono mt-1.5 block">{n.patientName} • {n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* iOS Footer Tabs simulated */}
            <div className="h-16 border-t border-white/5 bg-[#0a0f24]/95 backdrop-blur px-4 flex justify-between items-center z-40">
              
              <button 
                onClick={() => setActiveScreen('home')}
                className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-colors ${
                  activeScreen === 'home' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[9px] mt-1 font-medium font-sans">Home</span>
              </button>

              <button 
                onClick={() => setActiveScreen('patients')}
                className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-colors ${
                  activeScreen === 'patients' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-[9px] mt-1 font-medium font-sans">Patients</span>
              </button>

              <button 
                onClick={() => setActiveScreen('status')}
                className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-colors ${
                  activeScreen === 'status' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Heart className="w-5 h-5" />
                <span className="text-[9px] mt-1 font-medium font-sans">Vitals</span>
              </button>

              <button 
                onClick={() => setActiveScreen('meds')}
                className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-colors ${
                  activeScreen === 'meds' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-[9px] mt-1 font-medium font-sans">Meds</span>
              </button>

              <button 
                onClick={() => setActiveScreen('notifications')}
                className={`flex flex-col items-center justify-center flex-1 cursor-pointer transition-colors ${
                  activeScreen === 'notifications' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="text-[9px] mt-1 font-medium font-sans">Alerts</span>
              </button>

            </div>

            {/* iOS Home grab bar */}
            <div className="h-5 pb-2 bg-[#0a0f24] flex justify-center items-center z-40">
              <div className="w-28 h-1 bg-white/45 rounded-full" />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

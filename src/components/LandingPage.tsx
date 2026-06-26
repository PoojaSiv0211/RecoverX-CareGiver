/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HeartHandshake, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  Bell, 
  Plus,
  Tv, 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  FileText, 
  TrendingUp,
  Sliders,
  Smartphone
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: (tab: string) => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const [activeFloatingWidget, setActiveFloatingWidget] = useState<string | null>(null);
  const [demoNotificationCount, setDemoNotificationCount] = useState(3);

  // Stats in mock laptop dashboard
  const mockDashboardData = {
    patientName: "Arjun Mehta",
    recoveryScore: 84,
    medsCount: "2 / 3",
    exercisesDone: "2 / 4",
    heartRate: 72,
    painScore: 3,
    insight: "AI suggests 15% lower-limb stretching reps reduction due to Wed morning knee stiffness."
  };

  const floatingBadges = [
    {
      id: 'hands',
      title: 'Caring Hands',
      icon: HeartHandshake,
      color: 'from-blue-500 to-indigo-500',
      text: 'AI care coordinators streamline therapeutic schedules, matching recovery timelines to daily physical therapy logs.',
      position: 'top-[10%] left-[-4%] md:left-[-8%]'
    },
    {
      id: 'cross',
      title: 'Medical Cross',
      icon: Plus,
      color: 'from-red-500 to-pink-500',
      text: 'Direct telemetry links caregivers, clinic doctors, and surgical centers in one cohesive compliance record.',
      position: 'top-[42%] left-[-8%] md:left-[-12%]'
    },
    {
      id: 'heartbeat',
      title: 'Heartbeat Line',
      icon: Activity,
      color: 'from-emerald-500 to-teal-500',
      text: 'Continuous cardiac and pain indices telemetry flags anomalies in real-time, preventing outpatient setbacks.',
      position: 'bottom-[12%] left-[-2%] md:left-[-6%]'
    },
    {
      id: 'calendar',
      title: 'Calendar Protocol',
      icon: Calendar,
      color: 'from-purple-500 to-violet-500',
      text: 'Smart task agendas organize medication timings, assisted walking loops, and specialist clinical consultations.',
      position: 'top-[15%] right-[-4%] md:right-[-8%]'
    },
    {
      id: 'shield',
      title: 'Secure Shield',
      icon: ShieldCheck,
      color: 'from-amber-500 to-yellow-500',
      text: 'Privacy-focused clinical protocols shield sensitive patient information and protect therapeutic rehabilitation profiles.',
      position: 'top-[45%] right-[-8%] md:right-[-12%]'
    },
    {
      id: 'bell',
      title: 'Instant Alerts',
      icon: Bell,
      color: 'from-indigo-500 to-fuchsia-500',
      text: 'Urgent medication notifications and acute symptoms indicators trigger critical care alerts instantly.',
      position: 'bottom-[15%] right-[-2%] md:right-[-6%]'
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#fdfdff] text-slate-900 font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Decorative Blur Background Blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-purple-400/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Landing Header */}
      <header className="sticky top-0 z-50 w-full bg-[#fdfdff]/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/15">
            <HeartHandshake className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-extrabold text-xl md:text-2xl tracking-tight text-slate-800">
            RecoverX
          </span>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <button onClick={() => onEnterApp('dashboard')} className="hover:text-blue-600 transition-colors cursor-pointer">Interactive Dashboard</button>
          <button onClick={() => onEnterApp('report')} className="hover:text-blue-600 transition-colors cursor-pointer">Weekly Reports</button>
          <button onClick={() => onEnterApp('notifications')} className="hover:text-blue-600 transition-colors cursor-pointer">Care alerts</button>
          <button onClick={() => onEnterApp('mobile')} className="hover:text-blue-600 transition-colors cursor-pointer">Mobile App Applet</button>
        </nav>

        <button 
          onClick={() => onEnterApp('dashboard')}
          className="px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full text-sm font-semibold shadow-lg shadow-slate-200 transition-all hover:shadow-xl active:scale-95 cursor-pointer"
        >
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 text-center">
        
        {/* Sparkle Intro Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs text-blue-600 font-mono tracking-wide mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>PREMIUM OUTPATIENT REHABILITATION SAAS</span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto"
        >
          <span className="block text-slate-800">RecoverX Caregiver</span>
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Clinical Monitoring
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
        >
          Empowering caregivers with AI-powered patient monitoring, professional rehabilitation reports, medication tracking, and deep therapeutic insights.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <button 
            onClick={() => onEnterApp('dashboard')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Launch Caregiver Workspace</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => onEnterApp('mobile')}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Smartphone className="w-5 h-5 text-blue-600" />
            <span>Interactive Mobile Mockup</span>
          </button>
        </motion.div>

        {/* Dynamic Centerpiece: Interactive Laptop Dashboard surrounded by floating badges */}
        <div className="relative max-w-5xl mx-auto mt-8 px-4 sm:px-12 md:px-16">
          
          {/* Floating Badges */}
          {floatingBadges.map((badge, idx) => {
            const BadgeIcon = badge.icon;
            const isSelected = activeFloatingWidget === badge.id;
            
            return (
              <div 
                key={badge.id}
                className={`absolute ${badge.position} z-40 hidden md:block`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + (idx * 0.08) }}
                  whileHover={{ y: -4 }}
                  onClick={() => setActiveFloatingWidget(isSelected ? null : badge.id)}
                  className={`cursor-pointer p-3 rounded-2xl border transition-all duration-300 flex items-center space-x-2 bg-white ${
                    isSelected 
                      ? 'border-blue-300 ring-4 ring-blue-500/10 shadow-2xl scale-105 text-slate-800' 
                      : 'border-slate-100 hover:border-slate-200 shadow-md shadow-slate-100 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-gradient-to-tr ${badge.color} text-white shadow-sm`}>
                    <BadgeIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs text-slate-400 font-mono">Telemetry</span>
                    <span className="block text-sm font-semibold font-display tracking-tight text-slate-800">{badge.title}</span>
                  </div>
                </motion.div>

                {/* Explanatory Glass Card for Badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-16 left-0 w-64 bg-white/95 backdrop-blur border border-slate-200/80 p-4 rounded-2xl shadow-2xl z-50 text-left text-xs text-slate-700"
                    >
                      <h4 className="font-display font-bold text-sm text-blue-600 mb-1.5 flex items-center justify-between">
                        <span>{badge.title} Module</span>
                        <BadgeIcon className="w-4 h-4 text-blue-500/50" />
                      </h4>
                      <p className="text-slate-600 leading-relaxed font-sans">{badge.text}</p>
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveFloatingWidget(null);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Laptop Container Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-30 mx-auto max-w-4xl"
          >
            {/* Glossy Screen Case */}
            <div className="rounded-t-3xl border-t border-x border-slate-200 bg-slate-100 p-2.5 pb-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)]">
              {/* Screen Header Frame */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#fdfdff] rounded-t-2xl border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>care-terminal-v2.1.local</span>
                </div>
                <div className="w-10" />
              </div>

              {/* Screen Body View */}
              <div className="bg-[#fdfdff] p-4 text-left overflow-hidden h-[420px] md:h-[480px] rounded-b-lg relative group/screen">
                
                {/* Mockup Overlay hover to play */}
                <div className="absolute inset-0 bg-[#fdfdff]/90 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center opacity-100 group-hover/screen:opacity-0 pointer-events-none transition-opacity duration-300">
                  <div className="p-4 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-3 animate-bounce">
                    <Tv className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-800">Interactive Workspace Preview</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs text-center">Hover to interact or click any CTA button to navigate</p>
                </div>

                {/* Dashboard Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <HeartHandshake className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 font-display">RecoverX Admin Console</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Patient Recovery Monitor</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-mono border border-emerald-100">Telehealth Synced</span>
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-700 font-bold">PS</div>
                  </div>
                </div>

                {/* Dashboard Layout inside Laptop */}
                <div className="grid grid-cols-12 gap-3.5 text-xs h-[calc(100%-60px)] overflow-y-auto pr-1">
                  
                  {/* Left Column - Active Patient Vitals */}
                  <div className="col-span-12 md:col-span-5 space-y-3">
                    <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 font-medium">Selected Outpatient</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: pat-1</span>
                      </div>
                      <span className="text-sm font-bold text-slate-800 block">{mockDashboardData.patientName}</span>
                      <span className="text-[10px] text-blue-600 block font-medium mt-0.5">Post-Op Hip Joint Replacement</span>
                    </div>

                    {/* Vitals */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                        <span className="text-[10px] text-slate-400 block mb-1">Resting Cardiac</span>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-base font-bold text-rose-500 font-mono">{mockDashboardData.heartRate}</span>
                          <span className="text-[9px] text-slate-400">BPM</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                        <span className="text-[10px] text-slate-400 block mb-1">Pain Index</span>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-base font-bold text-amber-500 font-mono">{mockDashboardData.painScore}</span>
                          <span className="text-[9px] text-slate-400">/ 10</span>
                        </div>
                      </div>
                    </div>

                    {/* Recovery Gauge */}
                    <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-slate-600 font-medium font-display text-xs">Recovery Score</span>
                        <span className="text-blue-600 font-bold font-mono">{mockDashboardData.recoveryScore}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${mockDashboardData.recoveryScore}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Checklist & AI advice */}
                  <div className="col-span-12 md:col-span-7 space-y-3">
                    
                    {/* Progress checklist summary */}
                    <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-sm grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Medications</span>
                        <span className="text-sm font-bold text-slate-800 font-mono mt-0.5">{mockDashboardData.medsCount} Logged</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">PT Exercises</span>
                        <span className="text-sm font-bold text-slate-800 font-mono mt-0.5">{mockDashboardData.exercisesDone} Done</span>
                      </div>
                    </div>

                    {/* AI Clinician Insight card */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/30 to-purple-50/30 border border-blue-100/60">
                      <div className="flex items-center space-x-1.5 text-blue-600 font-bold text-[11px] mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                        <span>RecoverX AI Copilot Insight</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans italic">
                        "{mockDashboardData.insight}"
                      </p>
                      <div className="mt-2.5 flex justify-end">
                        <span className="text-[9px] font-mono text-slate-400">Model: gemini-3.5-flash</span>
                      </div>
                    </div>

                    {/* Navigation helper */}
                    <div className="p-2.5 rounded-xl bg-blue-50/20 border border-blue-100 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">Interact with complete dataset</span>
                      <button 
                        onClick={() => onEnterApp('dashboard')}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-[10px] transition-all cursor-pointer shadow-sm"
                      >
                        Enter Terminal
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Laptop Base Keyboard Frame */}
            <div className="h-4 bg-gradient-to-b from-slate-200 to-slate-300 rounded-b-2xl border-b-2 border-x border-slate-300 flex justify-center shadow-md">
              <div className="w-24 h-1 bg-slate-400 rounded-b-md" />
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-28 border-t border-slate-100 pt-20">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-center text-slate-800 mb-16">
            Designed for Outpatient <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Rehabilitation Excellence</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-blue-500/20 hover:shadow-xl hover:shadow-slate-100/50 transition-all text-left shadow-sm">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 w-fit mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Caregiver Dashboard</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Seamlessly track today's patient medications, physical therapies, hydration milestones, and daily nurse checklists in one sleek view.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-slate-100/50 transition-all text-left shadow-sm">
              <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 w-fit mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800 mb-2">AI Recovery Reports</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Generate clinical-grade weekly recovery reports, medication adherence analytics, and orthopedic milestones to share with surgeons easily.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-purple-500/20 hover:shadow-xl hover:shadow-slate-100/50 transition-all text-left shadow-sm">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 w-fit mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800 mb-2">Gemini AI Copilot</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Consult our integrated clinician AI regarding muscular stiffness, recovery progress, medication contraindications, and therapy guidelines.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Landing Footer */}
      <footer className="border-t border-slate-100 py-12 px-6 md:px-12 bg-slate-50 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <HeartHandshake className="w-5 h-5 text-blue-600" />
            <span className="font-display font-bold text-slate-800 text-base">RecoverX Caregiver</span>
          </div>
          <p>© 2026 RecoverX Caregiver Platforms Inc. Built with Google AI Studio. Privacy-Focused Outpatient Tracking.</p>
        </div>
      </footer>

    </div>
  );
}

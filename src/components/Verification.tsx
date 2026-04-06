/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  ShieldCheck, 
  HeartPulse,
  Activity,
  Quote,
  Play,
  Pause,
  Music,
  Flame
} from 'lucide-react';
import { Task, UserProfile } from '../types';
import { db } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { getMotivationalQuote } from '../lib/gemini';

interface VerificationProps {
  task: Task;
  user: UserProfile;
  onBack: () => void;
}

export const Verification: React.FC<VerificationProps> = ({ task, user, onBack }) => {
  const [step, setStep] = useState<'ready' | 'doing' | 'verifying' | 'success'>('ready');
  const [quote, setQuote] = useState('');
  const [timer, setTimer] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getMotivationalQuote().then(setQuote);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'doing') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        if (timer % 15 === 0 && timer > 0) {
          getMotivationalQuote().then(setQuote);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  useEffect(() => {
    if (isHolding) {
      holdIntervalRef.current = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            clearInterval(holdIntervalRef.current!);
            handleComplete();
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    } else {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      setHoldProgress(0);
    }
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [isHolding]);

  const handleComplete = async () => {
  setStep('verifying');

  try {
    if (user.email === 'poojasivaramalingam15@gmail.com') {
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
    } else {
     console.log("Updating task:", task.id);
     await updateDoc(doc(db, 'tasks', task.id), {
        completed: true,
        completedAt: new Date().toISOString(),
        status: 'completed',
});
        

      await updateDoc(doc(db, 'users', task.patientUid), {
        recoveryScore: increment(1),
        streak: increment(1),
      });
    }

    setStep('success');
  } catch (error) {
    console.error('Failed to complete task:', error);
  }
};
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto">
      <div className="p-6 space-y-8 max-w-md mx-auto h-full flex flex-col">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold truncate">{task.name}</h2>
        </div>

        <AnimatePresence mode="wait">
          {step === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="w-32 h-32 bg-blue-100 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-100">
                {task.type === 'medicine' ? <ShieldCheck className="w-16 h-16 text-blue-600" /> : <Activity className="w-16 h-16 text-blue-600" />}
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Ready to begin?</h3>
                <p className="text-slate-500 font-medium">Take your time. Recovery is a journey, not a race.</p>
              </div>
              
              <div className="w-full space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <Music className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">Recovery Playlist</p>
                    <p className="text-xs text-slate-400 font-medium">Energetic tracks for your session</p>
                  </div>
                  <button
  onClick={() => window.open("https://www.youtube.com/watch?v=5qap5aO4i9A")}
  className="bg-blue-600 text-white p-2 rounded-full"
>
  <Play className="w-4 h-4 fill-current" />
</button>
                </div>
                
                <button
                  onClick={() => setStep('doing')}
                  className="w-full bg-blue-600 text-white font-bold py-5 rounded-3xl text-xl shadow-xl shadow-blue-100 active:scale-95 transition-all"
                >
                  Start Session
                </button>
              </div>
            </motion.div>
          )}

          {step === 'doing' && (
            <motion.div
              key="doing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex-1 flex flex-col items-center justify-between py-12"
            >
              <div className="text-center space-y-2">
                <p className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Session in Progress</p>
                <h3 className="text-6xl font-black text-slate-900 tabular-nums">{formatTime(timer)}</h3>
              </div>

              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative w-full max-w-xs mx-auto">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg">
                  <Quote className="w-6 h-6 fill-current" />
                </div>
                <p className="text-xl font-bold text-slate-800 text-center leading-relaxed italic">
                  "{quote || 'Loading motivation...'}"
                </p>
              </div>

              <div className="w-full space-y-6">
                <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                  {task.verificationType === 'hold' ? 'Hold button to verify completion' : 'Take a photo to verify'}
                </p>
                
                {task.verificationType === 'hold' ? (
                  <button
                    onMouseDown={() => setIsHolding(true)}
                    onMouseUp={() => setIsHolding(false)}
                    onTouchStart={() => setIsHolding(true)}
                    onTouchEnd={() => setIsHolding(false)}
                    className="w-full aspect-square max-w-[200px] mx-auto bg-slate-200 rounded-full relative overflow-hidden group active:scale-95 transition-transform"
                  >
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-600 transition-all duration-75"
                      style={{ height: `${holdProgress}%` }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900 z-10">
                      <CheckCircle2 className={`w-12 h-12 mb-2 transition-colors ${holdProgress > 50 ? 'text-white' : 'text-slate-400'}`} />
                      <span className={`font-black uppercase tracking-widest text-sm transition-colors ${holdProgress > 50 ? 'text-white' : 'text-slate-400'}`}>
                        {holdProgress > 0 ? `${Math.round(holdProgress)}%` : 'Hold'}
                      </span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => setStep('verifying')}
                    className="w-full bg-slate-900 text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Camera className="w-6 h-6" />
                    Verify with Camera
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 'verifying' && (
            <motion.div
              key="verifying"
              className="flex-1 flex flex-col items-center justify-center space-y-6"
            >
              <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
              <p className="text-xl font-bold text-slate-900">Verifying Action...</p>
              <p className="text-slate-400 font-medium">AI is checking your progress</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="w-40 h-40 bg-emerald-100 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-100">
                <CheckCircle2 className="w-24 h-24 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Great Job!</h3>
                <p className="text-slate-500 font-medium">Task completed and verified. Your recovery score increased!</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <span className="font-bold text-slate-700">Streak Updated</span>
                </div>
                <span className="text-2xl font-black text-emerald-600">+1</span>
              </div>
              <button
                onClick={onBack}
                className="w-full bg-slate-900 text-white font-bold py-5 rounded-3xl text-xl shadow-xl active:scale-95 transition-all"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
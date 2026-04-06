/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Activity, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Flame,
  Target
} from 'lucide-react';
import { UserProfile } from '../types';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface PainHeatmapProps {
  user: UserProfile;
  onBack: () => void;
}

export const PainHeatmap: React.FC<PainHeatmapProps> = ({ user, onBack }) => {
  const [intensity, setIntensity] = useState(5);
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const bodyParts = [
    { id: 'head', label: 'Head', x: '50%', y: '10%' },
    { id: 'neck', label: 'Neck', x: '50%', y: '18%' },
    { id: 'shoulder-l', label: 'L Shoulder', x: '35%', y: '25%' },
    { id: 'shoulder-r', label: 'R Shoulder', x: '65%', y: '25%' },
    { id: 'chest', label: 'Chest', x: '50%', y: '30%' },
    { id: 'back-upper', label: 'Upper Back', x: '50%', y: '35%' },
    { id: 'back-lower', label: 'Lower Back', x: '50%', y: '45%' },
    { id: 'hip-l', label: 'L Hip', x: '40%', y: '55%' },
    { id: 'hip-r', label: 'R Hip', x: '60%', y: '55%' },
    { id: 'knee-l', label: 'L Knee', x: '40%', y: '75%' },
    { id: 'knee-r', label: 'R Knee', x: '60%', y: '75%' },
    { id: 'ankle-l', label: 'L Ankle', x: '40%', y: '90%' },
    { id: 'ankle-r', label: 'R Ankle', x: '60%', y: '90%' },
  ];

  const handleLogPain = async () => {
    if (!location) return;
    setLoading(true);
    try {
      if (user.email === 'poojasivaramalingam15@gmail.com') {
        // Simulate save for demo user
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        await addDoc(collection(db, 'painLogs'), {
          patientUid: user.uid,
          date: new Date().toISOString(),
          intensity,
          location,
          createdAt: serverTimestamp(),
        });
      }
      setSuccess(true);
      setTimeout(onBack, 2000);
    } catch (error) {
      console.error("Failed to log pain:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Pain Heatmap</h2>
      </div>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-20"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-100">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Pain Logged!</h3>
            <p className="text-slate-500 font-medium">Your data has been saved for AI analysis.</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Where does it hurt?</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tap to select location</p>
            </div>

            <div className="relative aspect-[1/2] max-w-[240px] mx-auto bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden">
              {/* Simple Human Outline SVG */}
              <svg viewBox="0 0 100 200" className="absolute inset-0 w-full h-full p-8 opacity-20 fill-slate-400">
                <path d="M50 10 C55 10 60 15 60 20 C60 25 55 30 50 30 C45 30 40 25 40 20 C40 15 45 10 50 10 M40 30 L60 30 L65 60 L60 100 L65 150 L60 190 L40 190 L35 150 L40 100 L35 60 Z" />
              </svg>

              {bodyParts.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setLocation(part.id)}
                  className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all ${
                    location === part.id 
                      ? 'bg-red-500 scale-150 shadow-lg shadow-red-200 ring-4 ring-red-100' 
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  style={{ left: part.x, top: part.y }}
                />
              ))}
              
              {location && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">
                  Selected: {bodyParts.find(p => p.id === location)?.label}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Intensity</h3>
              <span className={`text-2xl font-black ${
                intensity > 7 ? 'text-red-500' : intensity > 4 ? 'text-orange-500' : 'text-emerald-500'
              }`}>
                {intensity}/10
              </span>
            </div>

            <div className="space-y-4">
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={intensity} 
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>
          </div>

          <button
            disabled={!location || loading}
            onClick={handleLogPain}
            className="w-full bg-blue-600 text-white font-bold py-5 rounded-3xl flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-blue-100 active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Activity className="w-6 h-6" />}
            {loading ? 'Logging...' : 'Log Pain Intensity'}
          </button>
        </div>
      )}
    </div>
  );
};

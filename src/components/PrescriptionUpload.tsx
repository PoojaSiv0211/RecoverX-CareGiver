/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { UserProfile, PrescriptionItem } from '../types';
import { parsePrescription } from '../lib/gemini';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface PrescriptionUploadProps {
  user: UserProfile;
  onBack: () => void;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ user, onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PrescriptionItem[]>([]);
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const extractedItems = await parsePrescription(base64);
      setItems(extractedItems);
      setStep('review');
    } catch (error) {
      console.error("OCR failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (user.email === 'poojasivaramalingam15@gmail.com') {
        // Simulate save for demo user
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        // Save items to Firestore
        for (const item of items) {
          // Create tasks for each timing
          for (const time of item.timing) {
            const scheduledTime = new Date();
            if (time === 'morning') scheduledTime.setHours(8, 0, 0, 0);
            else if (time === 'afternoon') scheduledTime.setHours(13, 0, 0, 0);
            else if (time === 'evening') scheduledTime.setHours(18, 0, 0, 0);
            else if (time === 'night') scheduledTime.setHours(21, 0, 0, 0);

            await addDoc(collection(db, 'tasks'), {
              patientUid: user.uid,
              type: item.type,
              name: item.name,
              scheduledTime: scheduledTime.toISOString(),
              completed: false,
              verificationType: item.type === 'medicine' ? 'camera' : 'hold',
              status: 'pending',
              createdAt: serverTimestamp(),
            });
          }
        }
      }
      onBack();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">New Prescription</h2>
      </div>

      {step === 'upload' ? (
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[3/4] bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-blue-400 transition-colors relative overflow-hidden"
          >
            {image ? (
              <img src={image} alt="Prescription" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Camera className="w-8 h-8 text-blue-600" />
                </div>
                <p className="font-bold text-slate-900">Take a Photo</p>
                <p className="text-sm text-slate-400">or tap to upload from gallery</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>

          <button
            disabled={!image || loading}
            onClick={handleProcess}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-blue-100"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileText className="w-6 h-6" />}
            {loading ? 'Analyzing with AI...' : 'Process Prescription'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800 font-medium">
              AI has extracted the following items. Please review and confirm the schedule.
            </p>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative group">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                    item.type === 'medicine' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item.type}
                  </span>
                  <button 
                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                    className="text-slate-300 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-bold text-slate-900">{item.name}</h4>
                {item.dosage && <p className="text-sm text-slate-500">{item.dosage}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.timing.map((t, i) => (
                    <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-blue-100"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
            Confirm & Create Schedule
          </button>
        </div>
      )}
    </div>
  );
};

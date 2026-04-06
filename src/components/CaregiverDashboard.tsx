/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Users, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Bell, 
  Search,
  UserPlus,
  TrendingUp,
  FileText
} from 'lucide-react';
import { UserProfile, Task } from '../types';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit, addDoc, serverTimestamp, getDocs, updateDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { getDemoPatients, getDemoPatientTasks } from '../lib/mockData';

interface CaregiverDashboardProps {
  user: UserProfile;
  onBack: () => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({ user, onBack }) => {
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<UserProfile | null>(null);
  const [patientTasks, setPatientTasks] = useState<Task[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (user.email === 'poojasivaramalingam15@gmail.com') {
      setPatients(getDemoPatients());
      return;
    }

    const q = query(
      collection(db, 'users'),
      where('caregiverUid', '==', user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as unknown as UserProfile));
      setPatients(patientData);
    });
    return () => unsubscribe();
  }, [user.uid, user.email]);

  useEffect(() => {
    if (selectedPatient) {
      if (user.email === 'poojasivaramalingam15@gmail.com') {
        setPatientTasks(getDemoPatientTasks(selectedPatient.uid));
        return;
      }

      const q = query(
        collection(db, 'tasks'),
        where('patientUid', '==', selectedPatient.uid),
        orderBy('scheduledTime', 'desc'),
        limit(10)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const taskData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        setPatientTasks(taskData);
      });
      return () => unsubscribe();
    }
  }, [selectedPatient, user.email]);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientEmail) return;
    setAdding(true);

    try {
      if (user.email === 'poojasivaramalingam15@gmail.com') {
        // Simulate for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowAddModal(false);
        setNewPatientEmail('');
      } else {
        // Find user by email
        const q = query(collection(db, 'users'), where('email', '==', newPatientEmail));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          alert("User not found. Please ensure the patient has registered with this email.");
        } else {
          const patientDoc = snapshot.docs[0];
          await updateDoc(doc(db, 'users', patientDoc.id), {
            caregiverUid: user.uid
          });
          setShowAddModal(false);
          setNewPatientEmail('');
        }
      }
    } catch (error) {
      console.error("Failed to add patient:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Caregiver Dashboard</h2>
      </div>

      {!selectedPatient ? (
        <div className="space-y-6">
          <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight">Patient Monitoring</h3>
                <p className="text-emerald-100 text-sm font-medium">Track adherence and alerts for your family members.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-white text-emerald-600 font-bold py-3 px-6 rounded-2xl flex items-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                <UserPlus className="w-5 h-5" />
                Add Patient
              </button>
            </div>
          </div>

          {/* Add Patient Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 shadow-2xl"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Add Patient</h3>
                  <p className="text-slate-500 text-sm font-medium">Enter the email address of the family member you want to monitor.</p>
                </div>

                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email"
                      required
                      value={newPatientEmail}
                      onChange={(e) => setNewPatientEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={adding}
                      className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50"
                    >
                      {adding ? 'Adding...' : 'Add Patient'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-bold text-slate-900">Your Patients</h3>
              <button className="text-blue-600 text-sm font-bold">Manage</button>
            </div>

            <div className="space-y-3">
              {patients.map((patient) => (
                <button
                  key={patient.uid}
                  onClick={() => setSelectedPatient(patient)}
                  className="w-full bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-200 transition-all text-left"
                >
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-50">
                    <img src={patient.photoURL || 'https://picsum.photos/seed/patient/200'} alt={patient.displayName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{patient.displayName}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Adherence: {patient.recoveryScore}%</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-slate-300" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Patient Detail View */}
          <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-50">
              <img src={selectedPatient.photoURL || 'https://picsum.photos/seed/patient/200'} alt={selectedPatient.displayName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">{selectedPatient.displayName}</h3>
              <p className="text-sm text-slate-400 font-medium">Last active: {format(new Date(selectedPatient.lastActive), 'MMM d, h:mm a')}</p>
            </div>
            <button onClick={() => setSelectedPatient(null)} className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-red-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Patient Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Adherence</p>
              <p className="text-2xl font-black text-slate-900">{selectedPatient.recoveryScore}%</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Alerts</p>
              <p className="text-2xl font-black text-slate-900">0</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
              <button className="text-blue-600 text-sm font-bold flex items-center gap-1">
                Full Report <FileText className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {patientTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    task.completed ? 'bg-green-50 text-green-500' : 'bg-slate-50 text-slate-300'
                  }`}>
                    {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">{task.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {task.completed ? `Completed at ${format(new Date(task.completedAt!), 'h:mm a')}` : `Scheduled for ${format(new Date(task.scheduledTime), 'h:mm a')}`}
                    </p>
                  </div>
                  {task.status === 'missed' && (
                    <div className="bg-red-50 text-red-500 p-1 rounded-full">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

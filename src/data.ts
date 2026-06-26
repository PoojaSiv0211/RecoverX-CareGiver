/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient, NotificationItem, CaregiverSettings } from './types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'Arjun Mehta',
    age: 74,
    gender: 'Male',
    injury: 'Post-Op Hip Joint Replacement (Arthroplasty)',
    recoveryScore: 84,
    heartRate: 72,
    painScore: 3,
    adherence: 95,
    notes: 'Arjun is progressing very well. He completed his range of motion exercises with minimal assist yesterday, but reports stiffness in the early morning.',
    dailyChecklist: [
      { id: 't1', text: 'Morning blood pressure evaluation', completed: true, time: '08:00 AM', category: 'checkup' },
      { id: 't2', text: 'Take morning Lisinopril with food', completed: true, time: '08:15 AM', category: 'medication' },
      { id: 't3', text: 'Passive hip flexor stretch series (15 mins)', completed: true, time: '10:00 AM', category: 'exercise' },
      { id: 't4', text: 'Take midday Pain relief (Aspirin)', completed: true, time: '01:00 PM', category: 'medication' },
      { id: 't5', text: 'Afternoon quad sets & glute squeezes (20 mins)', completed: false, time: '03:30 PM', category: 'exercise' },
      { id: 't6', text: 'Evening walking drill (50 meters assisted)', completed: false, time: '06:00 PM', category: 'exercise' }
    ],
    medications: [
      { id: 'm1', name: 'Lisinopril (Blood Pressure)', dosage: '10mg', timing: 'Once daily (Morning)', taken: true, frequency: 'Daily' },
      { id: 'm2', name: 'Aspirin (Cardio Protection)', dosage: '81mg', timing: 'Once daily (Noon)', taken: true, frequency: 'Daily' },
      { id: 'm3', name: 'Gabapentin (Nerve Pain)', dosage: '300mg', timing: 'Twice daily (Morning/Night)', taken: false, frequency: 'Twice Daily' }
    ],
    exercises: [
      { id: 'e1', name: 'Ankle Pumps', duration: '5 mins', reps: '3 sets of 20 reps', completed: true },
      { id: 'e2', name: 'Quad Sets (Thigh squeezes)', duration: '10 mins', reps: '3 sets of 10 reps', completed: true },
      { id: 'e3', name: 'Gluteal Squeezes', duration: '10 mins', reps: '3 sets of 15 reps', completed: false },
      { id: 'e4', name: 'Heel Slides', duration: '15 mins', reps: '2 sets of 10 reps', completed: false }
    ],
    timeline: [
      { id: 'tl1', date: 'Week 1', event: 'Surgical Discharge', status: 'completed', description: 'Discharged from hospital care. Baseline assessment completed.' },
      { id: 'tl2', date: 'Week 2', event: 'Incision Checkup', status: 'completed', description: 'Staples removed by orthopedic nurse. Healing beautifully.' },
      { id: 'tl3', date: 'Week 3 (Current)', event: 'Range of Motion Milestone', status: 'upcoming', description: 'Targeting 90 degrees passive hip flexion.' },
      { id: 'tl4', date: 'Week 4', event: 'Primary Physical Therapy Assessment', status: 'upcoming', description: 'Evaluation of single-point cane mobility.' }
    ],
    analytics: [
      { day: 'Mon', recovery: 78, pain: 5, adherence: 90 },
      { day: 'Tue', recovery: 80, pain: 4, adherence: 100 },
      { day: 'Wed', recovery: 81, pain: 4, adherence: 95 },
      { day: 'Thu', recovery: 83, pain: 3, adherence: 92 },
      { day: 'Fri', recovery: 84, pain: 3, adherence: 95 },
      { day: 'Sat', recovery: 84, pain: 3, adherence: 90 },
      { day: 'Sun', recovery: 85, pain: 2, adherence: 100 }
    ]
  },
  {
    id: 'pat-2',
    name: 'Saanvi Sharma',
    age: 29,
    gender: 'Female',
    injury: 'Post-Op ACL Reconstruction & Meniscus Repair',
    recoveryScore: 68,
    heartRate: 68,
    painScore: 5,
    adherence: 88,
    notes: 'Saanvi is eager to return to running, but we must strictly pace her meniscus recovery. Pain spikes when knee flexion exceeds 60 degrees. Incision is slightly dry but healthy.',
    dailyChecklist: [
      { id: 't20', text: 'Apply cold therapy compress (20 mins)', completed: true, time: '09:00 AM', category: 'checkup' },
      { id: 't21', text: 'Take morning NSAID (Naproxen)', completed: true, time: '09:15 AM', category: 'medication' },
      { id: 't22', text: 'Ankle mobilize & calf stretch (10 mins)', completed: true, time: '11:00 AM', category: 'exercise' },
      { id: 't23', text: 'Passive extension hang (10 mins)', completed: false, time: '02:00 PM', category: 'exercise' },
      { id: 't24', text: 'Evening cold compression wrap', completed: false, time: '07:30 PM', category: 'checkup' }
    ],
    medications: [
      { id: 'm21', name: 'Naproxen (Anti-inflammatory)', dosage: '500mg', timing: 'Twice daily (Morning/Night)', taken: true, frequency: 'Twice Daily' },
      { id: 'm22', name: 'Acetaminophen (Pain)', dosage: '500mg', timing: 'As needed (Max 4x daily)', taken: false, frequency: 'As Needed' }
    ],
    exercises: [
      { id: 'e21', name: 'Patellar Mobilization', duration: '5 mins', reps: 'Gentle pressure, 4 directions', completed: true },
      { id: 'e22', name: 'Straight Leg Raises (Brace locked)', duration: '10 mins', reps: '3 sets of 10 reps', completed: true },
      { id: 'e23', name: 'Passive Extension Hangs', duration: '10 mins', reps: '2 sets of 5 mins', completed: false },
      { id: 'e24', name: 'Seated Calf Stretch', duration: '10 mins', reps: '3 sets of 30 sec hold', completed: false }
    ],
    timeline: [
      { id: 'tl21', date: 'Day 1', event: 'ACL Reconstruction', status: 'completed', description: 'Surgery completed successfully using hamstring graft.' },
      { id: 'tl22', date: 'Week 1', event: 'Passive Extension Goal', status: 'completed', description: 'Achieved full passive symmetry at 0 degrees.' },
      { id: 'tl23', date: 'Week 2 (Current)', event: 'Weight-bearing Progression', status: 'upcoming', description: 'Graduating to 50% partial weight-bearing.' },
      { id: 'tl24', date: 'Week 6', event: 'Brace Unlock Milestone', status: 'upcoming', description: 'Unlocking knee brace flexion up to 90 degrees.' }
    ],
    analytics: [
      { day: 'Mon', recovery: 62, pain: 6, adherence: 80 },
      { day: 'Tue', recovery: 64, pain: 5, adherence: 90 },
      { day: 'Wed', recovery: 65, pain: 5, adherence: 100 },
      { day: 'Thu', recovery: 66, pain: 5, adherence: 85 },
      { day: 'Fri', recovery: 68, pain: 5, adherence: 88 },
      { day: 'Sat', recovery: 67, pain: 4, adherence: 90 },
      { day: 'Sun', recovery: 69, pain: 4, adherence: 92 }
    ]
  },
  {
    id: 'pat-3',
    name: 'Madhav Verma',
    age: 61,
    gender: 'Male',
    injury: 'Ischemic Stroke Rehabilitation (Right Hemiparesis)',
    recoveryScore: 52,
    heartRate: 84,
    painScore: 4,
    adherence: 78,
    notes: 'Madhav is focusing heavily on neuromotor retraining for his right upper extremity. Speech is improving but tires out easily in the evening. Keep motivational levels high.',
    dailyChecklist: [
      { id: 't30', text: 'Blood pressure & heart rate scan', completed: true, time: '08:00 AM', category: 'checkup' },
      { id: 't31', text: 'Take morning Clopidogrel', completed: true, time: '08:15 AM', category: 'medication' },
      { id: 't32', text: 'Right hand grasp/release drill (15 mins)', completed: true, time: '10:30 AM', category: 'exercise' },
      { id: 't33', text: 'Mirror therapy exercise session', completed: false, time: '02:30 PM', category: 'exercise' },
      { id: 't34', text: 'Speech & swallowing practice (15 mins)', completed: false, time: '04:30 PM', category: 'checkup' },
      { id: 't35', text: 'Take evening Atorvastatin', completed: false, time: '08:00 PM', category: 'medication' }
    ],
    medications: [
      { id: 'm31', name: 'Clopidogrel (Antiplatelet)', dosage: '75mg', timing: 'Once daily (Morning)', taken: true, frequency: 'Daily' },
      { id: 'm32', name: 'Atorvastatin (Cholesterol)', dosage: '40mg', timing: 'Once daily (Evening)', taken: false, frequency: 'Daily' },
      { id: 'm33', name: 'Baclofen (Muscle Relaxant)', dosage: '10mg', timing: 'Twice daily (Morning/Night)', taken: true, frequency: 'Twice Daily' }
    ],
    exercises: [
      { id: 'e31', name: 'Grasp and Release', duration: '15 mins', reps: '3 sets of 10 grasp cycles', completed: true },
      { id: 'e32', name: 'Mirror Box Therapy', duration: '20 mins', reps: 'Visual tracking routine', completed: false },
      { id: 'e33', name: 'Shoulder Subluxation Bracing', duration: 'Continuous', reps: 'Ensure brace alignment', completed: true },
      { id: 'e34', name: 'Facial & Speech Articulation', duration: '15 mins', reps: 'Vowel elongation series', completed: false }
    ],
    timeline: [
      { id: 'tl31', date: 'Month 1', event: 'Acute Stabilization', status: 'completed', description: 'Inpatient ICU discharge and transfer to rehab wing.' },
      { id: 'tl32', date: 'Month 2 (Current)', event: 'Neuromotor Retraining', status: 'completed', description: 'Initiation of intensive task-oriented limb therapies.' },
      { id: 'tl33', date: 'Month 3', event: 'Gait Assessment', status: 'upcoming', description: 'Assessing unassisted posture and right-leg loading.' },
      { id: 'tl34', date: 'Month 6', event: 'ADL Independence', status: 'upcoming', description: 'Targeting independent dressing and eating protocols.' }
    ],
    analytics: [
      { day: 'Mon', recovery: 48, pain: 4, adherence: 70 },
      { day: 'Tue', recovery: 49, pain: 4, adherence: 80 },
      { day: 'Wed', recovery: 50, pain: 3, adherence: 75 },
      { day: 'Thu', recovery: 51, pain: 4, adherence: 85 },
      { day: 'Fri', recovery: 52, pain: 4, adherence: 78 },
      { day: 'Sat', recovery: 53, pain: 3, adherence: 80 },
      { day: 'Sun', recovery: 54, pain: 3, adherence: 85 }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'emergency',
    title: 'Elevated Heart Rate Warning',
    message: 'Madhav Verma recorded a sudden heart rate peak of 112 BPM during light standing rest. Please check his blood pressure.',
    time: '15 mins ago',
    patientName: 'Madhav Verma',
    read: false
  },
  {
    id: 'n2',
    type: 'medication_alert',
    title: 'Missed Medication Reminders',
    message: 'Saanvi Sharma has not logged her midday Acetaminophen. Ensure her pain levels remain stabilized.',
    time: '1 hour ago',
    patientName: 'Saanvi Sharma',
    read: false
  },
  {
    id: 'n3',
    type: 'ai_suggestion',
    title: 'AI Insight: Flexion Resistance',
    message: 'Arjun Mehta has consistently high pain levels (5/10) during hip exercises on Wednesday. We recommend reducing reps by 15% and focusing on range.',
    time: '2 hours ago',
    patientName: 'Arjun Mehta',
    read: false
  },
  {
    id: 'n4',
    type: 'milestone',
    title: 'Weekly Goal Achieved',
    message: 'Arjun Mehta completed all 7 days of Lisinopril adherence. Recovery index increased to 84%!',
    time: '4 hours ago',
    patientName: 'Arjun Mehta',
    read: true
  },
  {
    id: 'n5',
    type: 'appointment',
    title: 'Orthopedic Progress Telehealth',
    message: 'Saanvi Sharma has an upcoming clinical check-up on Zoom with Dr. Alisha Banerjee.',
    time: 'Tomorrow, 10:00 AM',
    patientName: 'Saanvi Sharma',
    read: true
  }
];

export const DEFAULT_SETTINGS: CaregiverSettings = {
  profileName: 'Nurse Priya Sharma, RN',
  profileEmail: 'priya.sharma@recoverx.care',
  role: 'Lead Rehabilitation Coordinator',
  notificationsEnabled: true,
  voiceAssistant: true,
  language: 'English (US)',
  emergencyContactName: 'Dr. Gaurav Sen (On-Call MD)',
  emergencyContactPhone: '+1 (555) 019-2834',
  privacyMode: false,
  theme: 'light'
};

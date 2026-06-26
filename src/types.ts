/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  injury: string;
  recoveryScore: number;
  heartRate: number;
  painScore: number;
  adherence: number;
  notes: string;
  dailyChecklist: Task[];
  medications: Medication[];
  exercises: Exercise[];
  timeline: TimelineEvent[];
  analytics: WeeklyAnalytics[];
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  time: string;
  category: 'medication' | 'exercise' | 'checkup' | 'hygiene';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  taken: boolean;
  frequency: string;
}

export interface Exercise {
  id: string;
  name: string;
  duration: string;
  reps: string;
  completed: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  event: string;
  status: 'completed' | 'upcoming' | 'milestone';
  description: string;
}

export interface WeeklyAnalytics {
  day: string;
  recovery: number;
  pain: number;
  adherence: number;
}

export interface NotificationItem {
  id: string;
  type: 'emergency' | 'medication_alert' | 'appointment' | 'milestone' | 'ai_suggestion';
  title: string;
  message: string;
  time: string;
  patientName: string;
  read: boolean;
}

export interface CaregiverSettings {
  profileName: string;
  profileEmail: string;
  role: string;
  notificationsEnabled: boolean;
  voiceAssistant: boolean;
  language: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  privacyMode: boolean;
  theme: 'light' | 'dark';
}

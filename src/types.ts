/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'patient' | 'caregiver';
  streak: number;
  lastActive: string; // ISO date
  recoveryScore: number;
  caregiverUid?: string;
  language?: 'English' | 'Tamil' | 'Hindi' | 'Telugu';
}

export interface Prescription {
  id: string;
  patientUid: string;
  imageUrl: string;
  extractedText: string;
  items: PrescriptionItem[];
  createdAt: string;
}

export interface PrescriptionItem {
  type: 'medicine' | 'exercise';
  name: string;
  dosage?: string;
  frequency: string;
  timing: string[]; // e.g., ["morning", "afternoon", "evening"]
  duration?: string;
  instructions?: string;
}

export interface Task {
  id: string;
  patientUid: string;
  type: 'medicine' | 'exercise';
  name: string;
  scheduledTime: string; // ISO date
  completed: boolean;
  completedAt?: string;
  verificationType: 'hold' | 'camera';
  status: 'pending' | 'completed' | 'missed';
}

export interface PainLog {
  id: string;
  patientUid: string;
  date: string;
  intensity: number; // 1-10
  location: string; // e.g., "lower-back", "knee"
  notes?: string;
}

export interface SideEffect {
  id: string;
  patientUid: string;
  date: string;
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
}

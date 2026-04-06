/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Task, PainLog } from '../types';
import { subDays, startOfDay, addHours } from 'date-fns';

export const getDemoUser = (email: string): UserProfile => ({
  uid: 'demo-user-123',
  email: email,
  displayName: 'Pooja Sivaramalingam',
  photoURL: 'https://picsum.photos/seed/pooja/200',
  role: 'patient',
  streak: 14,
  lastActive: new Date().toISOString(),
  recoveryScore: 88,
});

export const getDemoTasks = (uid: string): Task[] => {
  const today = startOfDay(new Date());
  return [
    {
      id: 'task-1',
      patientUid: uid,
      type: 'medicine',
      name: 'Amoxicillin 500mg',
      scheduledTime: addHours(today, 8).toISOString(),
      completed: true,
      completedAt: addHours(today, 8).toISOString(),
      verificationType: 'camera',
      status: 'completed',
    },
    {
      id: 'task-2',
      patientUid: uid,
      type: 'exercise',
      name: 'Knee Extensions (15 reps x 3)',
      scheduledTime: addHours(today, 10).toISOString(),
      completed: true,
      completedAt: addHours(today, 10).toISOString(),
      verificationType: 'hold',
      status: 'completed',
    },
    {
      id: 'task-3',
      patientUid: uid,
      type: 'medicine',
      name: 'Ibuprofen 400mg',
      scheduledTime: addHours(today, 13).toISOString(),
      completed: false,
      verificationType: 'camera',
      status: 'pending',
    },
    {
      id: 'task-4',
      patientUid: uid,
      type: 'exercise',
      name: 'Wall Squats (10 reps x 2)',
      scheduledTime: addHours(today, 17).toISOString(),
      completed: false,
      verificationType: 'hold',
      status: 'pending',
    },
    {
      id: 'task-5',
      patientUid: uid,
      type: 'medicine',
      name: 'Amoxicillin 500mg',
      scheduledTime: addHours(today, 20).toISOString(),
      completed: false,
      verificationType: 'camera',
      status: 'pending',
    },
  ];
};

export const getDemoPainLogs = (uid: string): PainLog[] => {
  const today = new Date();
  return [
    { id: 'p1', patientUid: uid, date: subDays(today, 6).toISOString(), intensity: 8, location: 'knee-r' },
    { id: 'p2', patientUid: uid, date: subDays(today, 5).toISOString(), intensity: 7, location: 'knee-r' },
    { id: 'p3', patientUid: uid, date: subDays(today, 4).toISOString(), intensity: 6, location: 'knee-r' },
    { id: 'p4', patientUid: uid, date: subDays(today, 3).toISOString(), intensity: 5, location: 'knee-r' },
    { id: 'p5', patientUid: uid, date: subDays(today, 2).toISOString(), intensity: 4, location: 'knee-r' },
    { id: 'p6', patientUid: uid, date: subDays(today, 1).toISOString(), intensity: 3, location: 'knee-r' },
    { id: 'p7', patientUid: uid, date: today.toISOString(), intensity: 2, location: 'knee-r' },
  ];
};

export const getDemoPatients = (): UserProfile[] => [
  {
    uid: 'patient-1',
    email: 'patient1@example.com',
    displayName: 'Sivaramalingam K.',
    photoURL: 'https://picsum.photos/seed/patient1/200',
    role: 'patient',
    streak: 5,
    lastActive: new Date().toISOString(),
    recoveryScore: 72,
  },
  {
    uid: 'patient-2',
    email: 'patient2@example.com',
    displayName: 'Lakshmi S.',
    photoURL: 'https://picsum.photos/seed/patient2/200',
    role: 'patient',
    streak: 12,
    lastActive: subDays(new Date(), 1).toISOString(),
    recoveryScore: 94,
  },
];

export const getDemoPatientTasks = (uid: string): Task[] => {
  const today = startOfDay(new Date());
  return [
    {
      id: 'pt-1',
      patientUid: uid,
      type: 'medicine',
      name: 'Blood Pressure Meds',
      scheduledTime: addHours(today, 9).toISOString(),
      completed: true,
      completedAt: addHours(today, 9).toISOString(),
      verificationType: 'camera',
      status: 'completed',
    },
    {
      id: 'pt-2',
      patientUid: uid,
      type: 'exercise',
      name: 'Shoulder Mobility',
      scheduledTime: addHours(today, 11).toISOString(),
      completed: false,
      verificationType: 'hold',
      status: 'pending',
    },
  ];
};

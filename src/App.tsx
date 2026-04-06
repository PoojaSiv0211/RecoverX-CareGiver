/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from './types';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Tasks } from './components/Tasks';
import { Recovery } from './components/Recovery';
import { Profile } from './components/Profile';
import { Loader2 } from 'lucide-react';
import { getDemoUser } from './lib/mockData';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check for demo user
        if (firebaseUser.email === 'poojasivaramalingam15@gmail.com') {
          setUser(getDemoUser(firebaseUser.email));
        } else {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as UserProfile);
          } else {
            // Fallback for new users
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              photoURL: firebaseUser.photoURL || '',
              role: 'patient',
              streak: 0,
              lastActive: new Date().toISOString(),
              recoveryScore: 0,
            });
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">RecoverX -Caregiver is loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'tasks':
        return <Tasks user={user} />;
      case 'recovery':
        return <Recovery user={user} />;
      case 'profile':
        return <Profile user={user} setUser={setUser} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} language={user.language}>
      {renderContent()}
    </Layout>
  );
}

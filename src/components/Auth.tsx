/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, HeartPulse, Activity } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        onLogin(userDoc.data() as UserProfile);
      } else {
        const newUser: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || '',
          role: 'patient',
          streak: 0,
          lastActive: new Date().toISOString(),
          recoveryScore: 0,
        };
        await setDoc(doc(db, 'users', user.uid), newUser);
        onLogin(newUser);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      let message = "Login failed. Please try again.";
      if (err.code === 'auth/unauthorized-domain') {
        message = "This domain is not authorized for Google Sign-in. Please add it to your Firebase Console authorized domains.";
      } else if (err.code === 'auth/popup-blocked') {
        message = "Sign-in popup was blocked by your browser. Please allow popups for this site.";
      } else if (err.code === 'auth/popup-closed-by-user') {
        message = "Sign-in was cancelled. Please try again.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <Activity className="absolute top-10 left-10 w-24 h-24 animate-pulse" />
        <HeartPulse className="absolute bottom-20 right-10 w-32 h-32 animate-bounce" />
        <ShieldCheck className="absolute top-1/2 left-1/4 w-16 h-16 opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 text-center space-y-8 max-w-md w-full"
      >
        <div className="space-y-4">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-white/30">
            <Activity className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter">RecoverX</h1>
          <p className="text-blue-100 text-lg font-medium">Your AI-Powered Path to Recovery</p>
        </div>

        <div className="space-y-4 bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl">
          <p className="text-sm text-blue-50 text-left leading-relaxed">
            Personalized rehabilitation, medication tracking, and caregiver insights. 
            Join thousands recovering smarter.
          </p>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-xs text-red-100 text-left flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-50 transition-all active:scale-95 shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-6 h-6" />
                Sign in with Google
              </>
            )}
          </button>
          
          <p className="text-[10px] text-blue-200 uppercase tracking-widest font-bold">
            Secure • HIPAA Compliant • AI-Driven
          </p>
        </div>
      </motion.div>
    </div>
  );
};

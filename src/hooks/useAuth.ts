import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authAdapter } from '../lib/adapters/authAdapter';
import { isDemoMode } from '../lib/adapters';

interface Profile {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  city?: string;
  state?: string;
  avatar?: string;
  plan: 'trial' | 'basic' | 'premium';
  trial_days_left: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode] = useState(isDemoMode());

  useEffect(() => {
    if (demoMode) {
      // Modo demo
      authAdapter.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setProfile(session.user as Profile);
        }
        setLoading(false);
      });

      const { data: { subscription } } = authAdapter.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          if (session?.user) {
            setProfile(session.user as Profile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // Modo real com Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          if (session?.user) {
            await loadProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
        }
      );

      return () => subscription.unsubscribe();
    }
  }, [demoMode]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    if (demoMode) {
      const { data, error } = await authAdapter.signUp(email, password, userData);
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      if (error) throw error;
      return data;
    }
  };

  const signIn = async (email: string, password: string) => {
    if (demoMode) {
      const { data, error } = await authAdapter.signIn(email, password);
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    }
  };

  const signOut = async () => {
    if (demoMode) {
      const { error } = await authAdapter.signOut();
      if (error) throw error;
    } else {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    if (demoMode) {
      const currentProfile = JSON.parse(localStorage.getItem('demo_user') || '{}');
      const updatedProfile = { ...currentProfile, ...updates };
      localStorage.setItem('demo_user', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      return updatedProfile;
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    }
  };

  const hasFeature = (feature: string): boolean => {
    if (!profile) return false;
    
    const premiumFeatures = [
      'leads',
      'marketing',
      'campaigns',
      'ai-assistant',
      'advanced-reports',
      'quick-offers',
      'gamification'
    ];

    if (premiumFeatures.includes(feature)) {
      return profile.plan === 'premium' || profile.plan === 'trial';
    }

    return true; // Funcionalidades básicas sempre disponíveis
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    hasFeature,
    demoMode
  };
}
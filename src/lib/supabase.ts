import { createClient } from '@supabase/supabase-js';
import { isDemoMode } from './adapters';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!isDemoMode() && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = isDemoMode() 
  ? null as any // Will use adapters instead
  : createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export interface Profile {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  city?: string;
  state?: string;
  avatar?: string;
  plan: string;
  trial_days_left: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  cleaning_type: string;
  frequency: string;
  total_paid: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  client_id: string;
  date: string;
  time: string;
  category: string;
  value: number;
  status: string;
  notes?: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  created_at: string;
  updated_at: string;
  clients?: Client;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  service: string;
  budget?: number;
  distance?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  lead_id?: string;
  sender_id: string;
  sender_name: string;
  message: string;
  message_type: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  created_at: string;
}
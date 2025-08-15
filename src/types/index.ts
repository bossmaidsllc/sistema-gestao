export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  cleaningType: 'Regular' | 'Deep Clean' | 'Move In-Out' | 'Airbnb';
  frequency: string;
  totalPaid: number;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  phone: string;
  email: string;
  address: string;
  date: Date;
  time: string;
  category: 'Regular' | 'Deep Clean' | 'Move In-Out' | 'Airbnb';
  value: number;
  notes: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  budget: number;
  distance: string;
  createdAt: Date;
  status: 'new' | 'contacted' | 'converted' | 'lost';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: number;
  duration: string;
  thumbnail: string;
  completed: boolean;
}
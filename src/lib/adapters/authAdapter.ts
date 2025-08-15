import { isDemoMode } from './index';

// Demo user data
const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@bossmaidspro.com',
  name: 'Maria Silva',
  company: 'Silva Cleaning Services',
  phone: '(305) 555-0123',
  city: 'Miami',
  state: 'FL',
  plan: 'trial',
  trial_days_left: 7,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

class DemoAuthAdapter {
  private user: any = null;
  private profile: any = null;

  async getSession() {
    if (isDemoMode()) {
      const savedUser = localStorage.getItem('demo_user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
        this.profile = this.user;
        return { data: { session: { user: this.user } } };
      }
    }
    return { data: { session: null } };
  }

  async signUp(email: string, password: string, userData: any) {
    if (isDemoMode()) {
      const demoUser = {
        ...DEMO_USER,
        email,
        ...userData,
        id: 'demo-user-' + Date.now()
      };
      
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      this.user = demoUser;
      this.profile = demoUser;
      
      return { data: { user: demoUser } };
    }
    throw new Error('Supabase não configurado');
  }

  async signIn(email: string, password: string) {
    if (isDemoMode()) {
      const demoUser = { ...DEMO_USER, email };
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      this.user = demoUser;
      this.profile = demoUser;
      
      return { data: { user: demoUser } };
    }
    throw new Error('Supabase não configurado');
  }

  async signOut() {
    if (isDemoMode()) {
      localStorage.removeItem('demo_user');
      this.user = null;
      this.profile = null;
      return { error: null };
    }
    throw new Error('Supabase não configurado');
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (isDemoMode()) {
      // Simular mudança de estado
      setTimeout(() => {
        const savedUser = localStorage.getItem('demo_user');
        if (savedUser) {
          callback('SIGNED_IN', { user: JSON.parse(savedUser) });
        } else {
          callback('SIGNED_OUT', null);
        }
      }, 100);
      
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
}

export const authAdapter = new DemoAuthAdapter();
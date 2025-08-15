import React from 'react';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { isDemoMode } from './lib/adapters';
import DemoModeIndicator from './components/DemoMode/DemoModeIndicator';
import AuthGuard from './components/Auth/AuthGuard';
import PostCheckout from './components/PostCheckout/PostCheckout';
import Login from './components/Auth/Login';
import PublicLanding from './components/LandingPage/PublicLanding';
import Dashboard from './components/Dashboard/Dashboard';
import Schedule from './components/Schedule/Schedule';
import Clients from './components/Clients/Clients';
import Leads from './components/Leads/Leads';
import Campaigns from './components/Campaigns/Campaigns';
import Chat from './components/Chat/Chat';
import Courses from './components/Courses/Courses';
import AIAssistant from './components/AIAssistant/AIAssistant';
import Billing from './components/Billing/Billing';
import Reports from './components/Reports/Reports';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Layout/Header';
import Signup from './components/Auth/Signup';

function App() {
  const { user, profile, loading, hasFeature, demoMode } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [showLogin, setShowLogin] = React.useState(false);
  const [showSignup, setShowSignup] = React.useState(false);
  
  // Check URL path to determine what to show
  const path = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  const demoCheckout = urlParams.get('demo_checkout');

  // Handle successful checkout redirect
  useEffect(() => {
    const plan = urlParams.get('plan');
    
    if (sessionId || demoCheckout) {
      // Handle demo checkout
      if (demoCheckout === 'success' && plan && demoMode) {
        const demoUser = JSON.parse(localStorage.getItem('demo_user') || '{}');
        demoUser.plan = plan;
        demoUser.subscription_status = 'active';
        demoUser.stripe_customer_id = `demo_customer_${Date.now()}`;
        demoUser.stripe_subscription_id = `demo_sub_${Date.now()}`;
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        
        // Show success message
        setTimeout(() => {
          alert(`🎉 Plano ${plan === 'premium' ? 'Premium' : 'Básico'} ativado com sucesso!`);
        }, 1000);
      }
      
      // Clean URL
      window.history.replaceState({}, document.title, '/app');
    }
  }, [sessionId, demoCheckout, demoMode]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'schedule':
        return <Schedule />;
      case 'clients':
        return <Clients />;
      case 'leads':
        return hasFeature('leads') ? <Leads /> : <UpgradePrompt feature="Leads Premium" />;
      case 'campaigns':
        return hasFeature('campaigns') ? <Campaigns /> : <UpgradePrompt feature="Campanhas Automáticas" />;
      case 'chat':
        return <Chat />;
      case 'courses':
        return <Courses />;
      case 'ai-assistant':
        return hasFeature('ai-assistant') ? <AIAssistant /> : <UpgradePrompt feature="Assistente de IA" />;
      case 'billing':
        return <Billing />;
      case 'reports':
        return hasFeature('advanced-reports') ? <Reports /> : <UpgradePrompt feature="Relatórios Avançados" />;
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>
            <p className="text-gray-600 mt-2">Em desenvolvimento...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const UpgradePrompt = ({ feature }: { feature: string }) => (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="text-3xl">👑</div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recurso Premium</h2>
        <p className="text-gray-600 mb-6">
          {feature} está disponível apenas no plano Premium. 
          Faça upgrade para desbloquear esta funcionalidade.
        </p>
        <button
          onClick={() => setCurrentPage('billing')}
          className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Fazer Upgrade
        </button>
      </div>
    </div>
  );

  // Auto-login in demo mode
  useEffect(() => {
    if (demoMode && !user && !showLogin) {
      const savedUser = localStorage.getItem('demo_user');
      if (!savedUser) {
        // Create demo user automatically
        const demoUser = {
          id: 'demo-user-123',
          email: 'demo@bossmaidspro.com',
          name: 'Maria Silva (Demo)',
          company: 'Silva Cleaning Services',
          phone: '(305) 555-0123',
          city: 'Miami',
          state: 'FL',
          plan: 'trial',
          trial_days_left: 7,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
      }
    }
  }, [demoMode, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show post-checkout page
  if (sessionId && !user) {
    return <PostCheckout />;
  }
  
  // Show public landing for root path
  if (path === '/' || path === '') {
    return (
      <PublicLanding onLogin={() => {}} onSignup={() => {}} />
    );
  }

  // Show login for /login path
  if (path === '/login') {
    return (
      <Login 
        onBack={() => window.location.href = '/'} 
        onSignupRedirect={() => window.location.href = '/signup'}
      />
    );
  }

  // Show signup for /signup path
  if (path === '/signup') {
    return (
      <Signup onLoginRedirect={() => window.location.href = '/login'} />
    );
  }

  // Protected app routes
  if (path.startsWith('/app')) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen bg-gray-100">
          <DemoModeIndicator />
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          
          <div className="flex-1 flex flex-col">
            <Header currentPage={currentPage} />
            
            <main className="flex-1">
              {renderCurrentPage()}
            </main>
          </div>
        </div>
      </AuthGuard>
    );
  }
  
  // Default to landing page
  if (showLogin) {
    return (
      <Login 
        onBack={() => setShowLogin(false)}
        onSignupRedirect={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
    );
  }

  if (showSignup) {
    return (
      <Signup onLoginRedirect={() => {
        setShowSignup(false);
        setShowLogin(true);
      }} />
    );
  }

  return (
    <PublicLanding 
      onLogin={() => setShowLogin(true)} 
      onSignup={() => setShowSignup(true)} 
    />
  );
}

export default App;
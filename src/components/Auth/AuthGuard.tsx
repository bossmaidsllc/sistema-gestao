import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Crown, Zap, CheckCircle, Shield } from 'lucide-react';
import { createCheckoutSession } from '../../lib/stripe';
import WhatsAppButton from '../WhatsApp/WhatsAppButton';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, profile, loading } = useAuth();

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

  // Not authenticated
  if (!user) {
    return <PaywallPage />;
  }

  // Authenticated but no active subscription
  if (!profile || (profile.subscription_status !== 'active' && profile.plan === 'trial' && profile.trial_days_left <= 0)) {
    return <PaywallPage />;
  }

  // Authenticated with active subscription
  return <>{children}</>;
}

function PaywallPage() {
  const [loading, setLoading] = React.useState(false);

  const handleCheckout = async (plan: 'basic' | 'premium') => {
    try {
      setLoading(true);
      const { url } = await createCheckoutSession(plan);
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 text-white">
      <WhatsAppButton />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12 sm:mb-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
              <Shield className="text-white" size={32} />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Acesso Exclusivo para 
              <span className="text-pink-400"> Assinantes</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10 max-w-3xl mx-auto">
              O Boss Maids Pro é um sistema premium. Para acessar todas as funcionalidades, 
              você precisa de uma assinatura ativa.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {[
              { icon: '🗓️', title: 'Agenda Inteligente', desc: 'Nunca mais esqueça um cliente' },
              { icon: '🤖', title: 'IA Marianna', desc: 'Assistente que fecha vendas' },
              { icon: '💰', title: 'Controle Financeiro', desc: 'Saiba exatamente quanto ganhou' },
              { icon: '📱', title: 'Marketing Automático', desc: 'Campanhas que trazem clientes' },
              { icon: '📚', title: 'Cursos Exclusivos', desc: 'Aprenda a cobrar mais caro' },
              { icon: '📊', title: 'Relatórios Avançados', desc: 'Analise seu crescimento' }
            ].map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-white mb-2 text-sm sm:text-base">{benefit.title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12 sm:mb-16">
            {/* Plano Básico */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Plano Básico</h3>
                <div className="text-4xl sm:text-5xl font-bold text-pink-400 mb-2">$19.90</div>
                <p className="text-gray-300 text-sm sm:text-base">/mês</p>
                <div className="bg-green-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold mt-3 sm:mt-4">
                  7 DIAS GRÁTIS
                </div>
              </div>
              
              <button
                onClick={() => handleCheckout('basic')}
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Começar Teste Grátis'}
              </button>
            </div>

            {/* Plano Premium */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 sm:p-8 text-white relative transform lg:scale-105">
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-black px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center shadow-lg">
                  <Crown size={12} className="mr-1" />
                  MAIS POPULAR
                </div>
              </div>
              
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Plano Premium</h3>
                <div className="text-4xl sm:text-5xl font-bold mb-2">$47</div>
                <p className="text-pink-100 text-sm sm:text-base">/mês</p>
                <div className="bg-yellow-400 text-black px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold mt-3 sm:mt-4">
                  7 DIAS GRÁTIS + IA
                </div>
              </div>
              
              <button
                onClick={() => handleCheckout('premium')}
                disabled={loading}
                className="w-full bg-white text-pink-600 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Quero Crescer - Premium'}
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield size={14} />
              <span>Pagamento 100% seguro</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={14} />
              <span>Sem compromisso</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award size={14} />
              <span>Suporte em português</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
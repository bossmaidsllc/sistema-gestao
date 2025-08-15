import React from 'react';
import { CreditCard, CheckCircle, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import CheckoutButton from '../Checkout/CheckoutButton';
import { createPortalSession } from '../../lib/stripe';
import { useAuth } from '../../hooks/useAuth';
import { isDemoMode } from '../../lib/adapters';

export default function Billing() {
  const { profile, demoMode } = useAuth();
  
  const handleManageSubscription = async () => {
    if (demoMode || !profile?.stripe_customer_id) {
      alert('Portal de cobrança simulado (modo demo)');
      return;
    }
    
    try {
      const { url } = await createPortalSession(profile.stripe_customer_id);
      window.location.href = url;
    } catch (error) {
      console.error('Error opening portal:', error);
      alert('Erro ao abrir portal de cobrança. Tente novamente.');
    }
  };
  
  const planDetails = {
    name: 'Boss Maids Pro',
    price: profile?.plan === 'premium' ? 47 : 19.90,
    billingDate: new Date('2024-01-22'),
    trialEnd: new Date('2024-01-15'),
    status: profile?.subscription_status || 'trial'
  };

  const features = [
    'Agenda ilimitada',
    'Cadastro de clientes',
    'Sistema de leads',
    'Chat integrado',
    'Assistente de IA',
    'Cursos e treinamentos',
    'Suporte prioritário',
    'Relatórios detalhados'
  ];

  const billingHistory = [
    { date: '15 Dec 2023', amount: 19.99, status: 'paid' },
    { date: '15 Nov 2023', amount: 19.99, status: 'paid' },
    { date: '15 Oct 2023', amount: 19.99, status: 'paid' }
  ];

  const daysLeft = Math.ceil((planDetails.trialEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Meu Plano</h2>
        <p className="text-gray-600">Gerencie sua assinatura e histórico de pagamentos</p>
      </div>

      {/* Trial Alert */}
      {planDetails.status === 'trial' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="text-yellow-400 mr-3 mt-0.5" size={20} />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Trial Gratuito</h3>
              <p className="text-yellow-700">
                Você tem <strong>{daysLeft} dias restantes</strong> no seu trial gratuito. 
                A cobrança de $19.99/mês iniciará em {planDetails.trialEnd.toLocaleDateString('pt-BR')}.
              </p>
              <button className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Adicionar Método de Pagamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{planDetails.name}</h3>
                <p className="text-gray-600">Plano Mensal</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-pink-600">${planDetails.price}</p>
                <p className="text-gray-500 text-sm">/mês</p>
              </div>
            </div>

            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              planDetails.status === 'trial' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {planDetails.status === 'trial' ? 'Trial Gratuito' : 'Ativo'}
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span className="text-sm">
                  {planDetails.status === 'trial' 
                    ? `Trial termina em ${planDetails.trialEnd.toLocaleDateString('pt-BR')}`
                    : `Próxima cobrança: ${planDetails.billingDate.toLocaleDateString('pt-BR')}`
                  }
                </span>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              {planDetails.status === 'trial' ? (
                <CheckoutButton
                  plan="basic"
                  userEmail={profile?.email}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Assinar Plano Básico
                </CheckoutButton>
              ) : (
                <button 
                  onClick={handleManageSubscription}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Gerenciar Pagamento
                </button>
              )}
              <button 
                onClick={handleManageSubscription}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cancelar Plano
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Recursos Inclusos</h4>
          <div className="mb-4">
            <CheckoutButton
              plan="premium"
              userEmail={profile?.email}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-4 rounded-lg font-bold transition-colors"
            >
              🚀 Upgrade para Premium - $47/mês
            </CheckoutButton>
          </div>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="text-green-500 mr-3" size={16} />
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <CreditCard className="mr-2" size={20} />
            Método de Pagamento
          </h3>
          
          {planDetails.status === 'trial' ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="mb-4">Nenhum método de pagamento adicionado</p>
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Adicionar Cartão
              </button>
            </div>
          ) : (
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <CreditCard className="text-white" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-600">Expira em 12/25</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Estatísticas</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Economia vs concorrentes</span>
              <span className="font-bold text-green-600">$180/mês</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leads convertidos</span>
              <span className="font-bold text-gray-800">47 este mês</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ROI estimado</span>
              <span className="font-bold text-pink-600">1,250%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <DollarSign className="mr-2" size={20} />
            Histórico de Pagamentos
          </h3>
        </div>
        
        <div className="p-6">
          {planDetails.status === 'trial' ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Nenhum pagamento realizado ainda</p>
              <p className="text-sm">O histórico aparecerá após o primeiro pagamento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {billingHistory.map((payment, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{payment.date}</p>
                    <p className="text-sm text-gray-600">Boss Maids Pro - Mensal</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">${payment.amount}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Pago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Support */}
      <div className="mt-8 bg-pink-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold text-pink-800 mb-2">Precisa de Ajuda?</h3>
        <p className="text-pink-700 mb-4">
          Nossa equipe está aqui para ajudar com qualquer questão sobre cobrança ou sua assinatura.
        </p>
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Contatar Suporte
        </button>
      </div>
    </div>
  );
}
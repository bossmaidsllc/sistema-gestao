import React, { useState } from 'react';
import { Check, Star, ArrowRight, Crown, Zap, Calendar, Users, MessageCircle, BarChart3, Bot, Phone, Mail, MapPin, Clock, DollarSign, Smartphone, CheckCircle, AlertTriangle, TrendingUp, Target, Shield, Award, Sparkles, Menu, X } from 'lucide-react';
import { isDemoMode } from '../../lib/adapters';
import WhatsAppButton from '../WhatsApp/WhatsAppButton';
import WhatsAppOnboarding from './WhatsAppOnboarding';

interface PublicLandingProps {
  onLogin: () => void;
  onSignup: () => void;
}

export default function PublicLanding({ onLogin, onSignup }: PublicLandingProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = (data: any) => {
    console.log('Onboarding data:', data);
    setShowOnboarding(false);
    
    // Redirecionar para Stripe com dados do lead
    window.location.href = 'https://buy.stripe.com/28E5kC39p8ZI3528ww';
  };

  const handleStartTrial = () => {
    setShowOnboarding(true);
  };

  const basicFeatures = [
    'Agenda Digital Completa',
    'Cadastro de Clientes',
    'Orçamentos Automáticos',
    'Controle Financeiro',
    'Notificações por SMS',
    'Fotos Antes/Depois',
    'Relatórios Básicos',
    'Suporte em Português'
  ];

  const premiumFeatures = [
    'Assistente IA Marianna',
    'Marketing Automático',
    'Campanhas por Email/SMS',
    'Leads Qualificados',
    'Precificação Inteligente',
    'Cursos Exclusivos',
    'Relatórios Avançados',
    'Suporte Prioritário'
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      location: 'Orlando, FL',
      text: 'Minha agenda vive cheia desde que comecei a usar! O sistema me ajuda a não esquecer nenhum cliente.',
      rating: 5,
      avatar: 'MS',
      revenue: '+$2,400/mês'
    },
    {
      name: 'Ana Costa',
      location: 'Miami, FL', 
      text: 'A Marianna me ajuda a responder clientes mais rápido e criar preços certeiros. Economizo 3 horas por dia!',
      rating: 5,
      avatar: 'AC',
      revenue: '+$1,800/mês'
    },
    {
      name: 'Carla Santos',
      location: 'Tampa, FL',
      text: 'As campanhas automáticas me trouxeram 12 novos clientes em um mês. Nunca pensei que fosse tão fácil!',
      rating: 5,
      avatar: 'CS',
      revenue: '+$3,200/mês'
    }
  ];

  const painPoints = [
    {
      icon: '📝',
      title: 'Caderno e WhatsApp Bagunçados',
      description: 'Você anota tudo no papel ou WhatsApp e sempre esquece algum cliente ou horário importante'
    },
    {
      icon: '😰',
      title: 'Clientes Esquecidos',
      description: 'Perde agendamentos porque não tem um sistema organizado para lembrar'
    },
    {
      icon: '💸',
      title: 'Dinheiro Perdido',
      description: 'Não sabe quanto ganhou, quanto gastou, e cobra preços errados'
    }
  ];

  const benefits = [
    {
      icon: Calendar,
      title: 'Agenda Inteligente',
      description: 'Nunca mais esqueça um cliente. Notificações automáticas no seu celular.',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Sparkles,
      title: 'IA Marianna - Sua Assistente',
      description: 'Cria preços automáticos, responde clientes e até fecha limpezas para você.',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: DollarSign,
      title: 'Controle Financeiro',
      description: 'Veja quanto ganhou, quanto vai receber e organize suas finanças.',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: MessageCircle,
      title: 'Marketing Automático',
      description: 'Campanhas por email e SMS para recuperar clientes antigos.',
      color: 'text-pink-600 bg-pink-100'
    },
    {
      icon: MapPin,
      title: 'Endereços Automáticos',
      description: 'Digite o endereço e o sistema completa tudo automaticamente.',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: TrendingUp,
      title: 'Cursos Exclusivos',
      description: 'Aprenda técnicas para conseguir mais clientes e cobrar mais caro.',
      color: 'text-indigo-600 bg-indigo-100'
    }
  ];

  const stats = [
    { number: '2,847', label: 'Limpadoras Ativas', icon: Users },
    { number: '87%', label: 'Aumentaram Faturamento', icon: TrendingUp },
    { number: '4.9/5', label: 'Avaliação Média', icon: Star },
    { number: '24/7', label: 'Suporte em Português', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-white">
      <WhatsAppButton />
      
      {/* Header */}
      <header className="bg-black text-white py-3 sm:py-4 px-4 sm:px-6 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src="/Orange and Dark Gray Retro Apparel Logo.png" 
              alt="Boss Maids Pro Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-pink-400">Boss Maids Pro</h1>
              <p className="text-xs text-gray-300 hidden sm:block">Sistema #1 para Limpeza</p>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-white p-2"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => window.location.href = '/login'}
              className="text-white hover:text-pink-300 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={handleStartTrial}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 sm:px-6 py-2 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              Teste Grátis 7 Dias
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pb-4 border-t border-gray-800">
            <div className="container mx-auto pt-4">
              <button
                onClick={() => {
                  window.location.href = '/login';
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors mb-3"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  handleStartTrial();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Teste Grátis 7 Dias
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-transparent"></div>
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-pink-500/20 border border-pink-500/30 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6">
              <Crown className="text-yellow-400 mr-2" size={16} />
              <span className="text-pink-300 font-medium text-sm sm:text-base">#1 Sistema para Limpeza nos EUA</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Nunca Mais Perca um 
              <span className="text-pink-400"> Agendamento</span>
            </h1>
            
            <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              Organize, Venda Mais e Tenha Sua Agenda Cheia!
            </h2>
            
            <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0">
              Boss Maids Pro é o sistema número #1 totalmente em português, com 
              <strong className="text-pink-400"> Inteligência Artificial Marianna</strong> para organizar sua agenda, 
              criar preços automáticos e até fechar limpezas para você!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
              <button
                onClick={handleStartTrial}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>📲 Teste Grátis por 7 Dias</span>
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Shield className="text-green-400" size={14} />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="text-green-400" size={14} />
                <span>7 dias grátis</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="text-green-400" size={14} />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-sm mx-auto">
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-4 sm:mb-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="font-bold text-sm sm:text-base">Hoje - 15 Jan</h3>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Calendar size={14} />
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                      <p className="font-medium text-xs sm:text-sm">Sarah Johnson</p>
                      <p className="text-xs text-pink-100">9:00 AM - Deep Clean - $150</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-2 sm:p-3">
                      <p className="font-medium text-xs sm:text-sm">Michael Davis</p>
                      <p className="text-xs text-pink-100">1:00 PM - Regular - $80</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-xs sm:text-sm mb-2">Receita de Hoje</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">$380</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 bg-pink-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 sm:w-32 sm:h-32 bg-yellow-400/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="text-white" size={20} />
                  </div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">{stat.number}</div>
                  <div className="text-xs sm:text-sm lg:text-base text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              O que está fazendo você 
              <span className="text-red-600"> perder clientes</span> (e dinheiro)
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Cada limpeza perdida é dinheiro que você nunca mais recupera
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {painPoints.map((pain, index) => (
              <div key={index} className="text-center p-6 sm:p-8 bg-red-50 rounded-2xl border-2 border-red-100">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">{pain.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-3 sm:mb-4">{pain.title}</h3>
                <p className="text-sm sm:text-base text-red-700">{pain.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center bg-red-100 border border-red-200 rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <AlertTriangle className="text-red-600 mr-2" size={16} />
              <span className="text-red-800 font-bold text-sm sm:text-base">
                Resultado: Agenda vazia, clientes perdidos, menos dinheiro no final do mês
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              O que o Boss Maids Pro 
              <span className="text-pink-600"> faz por você</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Transforme sua empresa de limpeza em um negócio organizado e lucrativo
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 border-l-4 border-pink-500">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${benefit.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">{benefit.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={handleStartTrial}
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors shadow-lg"
            >
              Teste Grátis por 7 Dias
            </button>
          </div>
        </div>
      </section>

      {/* Exclusivity Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-pink-500/20 border border-pink-500/30 rounded-full px-3 sm:px-4 py-2 mb-4 sm:mb-6">
              <span className="text-pink-300 font-medium text-sm sm:text-base">🇧🇷 Feito para Brasileiras nos EUA</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Criado para imigrantes que trabalham com 
              <span className="text-pink-400"> limpeza nos EUA</span>
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8">
              Tudo no seu idioma, sem complicação! Sabemos como é difícil usar sistemas em inglês 
              quando você está focada em trabalhar e ganhar dinheiro.
            </p>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400 flex-shrink-0" size={18} />
                <span className="text-sm sm:text-base lg:text-lg">Interface 100% em português</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400 flex-shrink-0" size={18} />
                <span className="text-sm sm:text-base lg:text-lg">Suporte em português via WhatsApp</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-400 flex-shrink-0" size={18} />
                <span className="text-sm sm:text-base lg:text-lg">Criado por quem entende o mercado americano</span>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleStartTrial}
                className="bg-white text-pink-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
              >
                <span>Começar Meu Teste Grátis Agora</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">Marianna - IA Assistente</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Especialista em Limpeza</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-100 rounded-2xl p-3 sm:p-4">
                  <p className="text-gray-800 text-xs sm:text-sm">
                    "Oi Maria! Para uma casa de 3 quartos em Miami, recomendo cobrar $150 
                    para Deep Clean. Baseado na sua região, esse preço está competitivo. 
                    Quer que eu envie o orçamento para a cliente?"
                  </p>
                </div>
                
                <div className="bg-pink-500 rounded-2xl p-3 sm:p-4 text-white ml-4 sm:ml-8">
                  <p className="text-xs sm:text-sm">
                    "Perfeito! Pode enviar sim. Obrigada Marianna!"
                  </p>
                </div>
                
                <div className="bg-gray-100 rounded-2xl p-3 sm:p-4">
                  <p className="text-gray-800 text-xs sm:text-sm">
                    "✅ Orçamento enviado! A cliente já visualizou. 
                    Dica: responda em até 5 minutos para aumentar as chances de fechar!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Showcase */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900 via-pink-900 to-black text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center bg-purple-500/20 border border-purple-500/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
              <Sparkles className="text-purple-300 mr-2" size={18} />
              <span className="text-purple-300 font-medium text-sm sm:text-base">Inteligência Artificial Exclusiva</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Conheça a Marianna: Sua 
              <span className="text-pink-400"> Assistente de IA</span>
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto">
              Uma especialista em limpeza com mais de 10 anos de experiência, 
              disponível 24/7 para ajudar você a crescer seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
                <h3 className="text-xl sm:text-2xl font-bold text-pink-400 mb-3 sm:mb-4">🧠 O que a Marianna faz:</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-400 mr-3 flex-shrink-0" size={16} />
                    <span className="text-sm sm:text-base">Calcula preços automáticos por região</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-400 mr-3 flex-shrink-0" size={16} />
                    <span className="text-sm sm:text-base">Responde clientes em segundos</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-400 mr-3 flex-shrink-0" size={16} />
                    <span className="text-sm sm:text-base">Cria campanhas de marketing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-400 mr-3 flex-shrink-0" size={16} />
                    <span className="text-sm sm:text-base">Ensina técnicas de limpeza</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-pink-500/30">
                <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2 sm:mb-3">💰 Resultado:</h3>
                <p className="text-sm sm:text-base lg:text-lg">
                  Nossas clientes economizam <strong className="text-pink-400">3 horas por dia</strong> e 
                  aumentam o faturamento em <strong className="text-green-400">média 68%</strong> no primeiro mês!
                </p>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl max-w-md mx-auto">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm sm:text-base">Marianna IA</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Especialista em Limpeza</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-2xl p-3 sm:p-4">
                    <p className="text-gray-800 text-xs sm:text-sm">
                      "Oi Maria! Para uma casa de 3 quartos em Miami, recomendo cobrar $150 
                      para Deep Clean. Baseado na sua região, esse preço está competitivo. 
                      Quer que eu envie o orçamento?"
                    </p>
                  </div>
                  
                  <div className="bg-pink-500 rounded-2xl p-3 sm:p-4 text-white ml-4 sm:ml-8">
                    <p className="text-xs sm:text-sm">
                      "Perfeito! Pode enviar sim. Obrigada Marianna!"
                    </p>
                  </div>
                  
                  <div className="bg-gray-100 rounded-2xl p-3 sm:p-4">
                    <p className="text-gray-800 text-xs sm:text-sm">
                      "✅ Orçamento enviado! A cliente já visualizou. 
                      Dica: responda em até 5 minutos para aumentar as chances de fechar!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              O que nossas clientes estão dizendo
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Resultados reais de limpadoras que transformaram seus negócios
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-2 border-gray-100 hover:border-pink-200 transition-all">
                <div className="flex justify-center mb-4 sm:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={18} />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg italic leading-relaxed">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">{testimonial.location}</p>
                    <p className="text-green-600 font-bold text-xs sm:text-sm">{testimonial.revenue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Escolha o plano ideal para 
              <span className="text-pink-600"> seu negócio</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">
              Comece grátis e cresça conforme sua necessidade
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Plano Básico */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-gray-200 hover:border-pink-300 transition-all">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Plano Básico</h3>
                <div className="text-4xl sm:text-5xl font-bold text-pink-600 mb-2">$19.90</div>
                <p className="text-sm sm:text-base text-gray-600">/mês após trial</p>
                <div className="bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold mt-3 sm:mt-4">
                  7 DIAS GRÁTIS
                </div>
              </div>
              
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {basicFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="text-green-500 mr-3 flex-shrink-0" size={18} />
                    <span className="text-gray-700 font-medium text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a
                href="https://buy.stripe.com/28E5kC39p8ZI3528ww"
                onClick={(e) => {
                  e.preventDefault();
                  handleStartTrial();
                }}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg block text-center"
              >
                Começar Teste Grátis
              </a>
            </div>

            {/* Plano Premium */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-2xl p-6 sm:p-8 text-white relative transform lg:scale-105">
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-black px-4 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center shadow-lg">
                  <Crown size={14} className="mr-1 sm:mr-2" />
                  MAIS POPULAR
                </div>
              </div>
              
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Plano Premium</h3>
                <div className="text-4xl sm:text-5xl font-bold mb-2">$47</div>
                <p className="text-pink-100 text-sm sm:text-base">/mês após trial</p>
                <div className="bg-yellow-400 text-black px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold mt-3 sm:mt-4">
                  7 DIAS GRÁTIS + IA
                </div>
              </div>
              
              <div className="mb-4 sm:mb-6">
                <p className="text-pink-100 text-xs sm:text-sm mb-3 sm:mb-4 font-medium">Tudo do Básico +</p>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="text-yellow-300 mr-3 flex-shrink-0" size={18} />
                      <span className="text-white font-medium text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <a
                href="https://buy.stripe.com/aFaaEW25l8ZIcFC0nA4Ni03"
                onClick={(e) => {
                  e.preventDefault();
                  handleStartTrial();
                }}
                className="w-full bg-white text-pink-600 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg block text-center"
              >
                Quero Crescer - Premium
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Sua empresa merece um 
            <span className="text-yellow-300"> sistema de verdade</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-pink-100 max-w-3xl mx-auto">
            Chega de perder clientes por falta de organização. 
            Mais de 2.800 limpadoras já transformaram seus negócios com o Boss Maids Pro.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-6 sm:mb-8">
            <button
              onClick={handleStartTrial}
              className="bg-white text-pink-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
            >
              <span>Teste Grátis por 7 Dias</span>
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-pink-200">
            <div className="flex items-center space-x-2">
              <Shield size={14} />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={14} />
              <span>7 dias grátis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award size={14} />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="sm:col-span-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4 sm:mb-6">
                <img 
                  src="/Orange and Dark Gray Retro Apparel Logo.png" 
                  alt="Boss Maids Pro Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-pink-400">Boss Maids Pro™</h3>
                  <p className="text-gray-300 text-sm sm:text-base">Sistema #1 para Limpeza nos EUA</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md mx-auto sm:mx-0 text-sm sm:text-base">
                Feito por quem entende de limpeza e sabe como é difícil crescer um negócio nos EUA. 
                Estamos aqui para ajudar você a ter sucesso!
              </p>
            </div>
            
            <div className="text-center sm:text-left">
              <h4 className="font-bold mb-3 sm:mb-4 text-pink-400">Suporte</h4>
              <div className="space-y-2 text-gray-300 text-sm sm:text-base">
                <p className="flex items-center justify-center sm:justify-start">
                  <Mail size={14} className="mr-2" />
                  suporte@bossmaidspro.com
                </p>
                <p className="flex items-center justify-center sm:justify-start">
                  <MessageCircle size={14} className="mr-2" />
                  WhatsApp em português
                </p>
                <p className="flex items-center justify-center sm:justify-start">
                  <Clock size={14} className="mr-2" />
                  Seg-Sex 9h-18h EST
                </p>
              </div>
            </div>
            
            <div className="text-center sm:text-left">
              <h4 className="font-bold mb-3 sm:mb-4 text-pink-400">Empresa</h4>
              <div className="space-y-2 text-gray-300 text-sm sm:text-base">
                <p>Sobre nós</p>
                <p>Termos de uso</p>
                <p>Política de privacidade</p>
                <p>Blog</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
              © 2024 Boss Maids Pro. Todos os direitos reservados.
            </p>
            <p className="text-pink-300 font-medium text-base sm:text-lg">
              "Sua empresa merece um sistema de verdade. Comece hoje e veja a diferença."
            </p>
          </div>
        </div>
      </footer>
      
      {/* WhatsApp Onboarding Modal */}
      {showOnboarding && (
        <WhatsAppOnboarding
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
}
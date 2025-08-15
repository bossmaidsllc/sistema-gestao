import React from 'react';
import { Check, Star, ArrowRight, Smartphone, MessageCircle, Calendar, TrendingUp, Users, Zap, Crown } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const basicFeatures = [
    'Agenda Digital Completa',
    'Cadastro de Clientes',
    'Orçamentos e Faturas',
    'Controle de Horas da Equipe',
    'Relatórios Básicos',
    'Chat Interno',
    'Checklists de Limpeza',
    'Fotos Antes/Depois'
  ];

  const premiumFeatures = [
    'Painel de Leads Prioritário',
    'Módulo de Marketing Completo',
    'Campanhas Automáticas (Email/SMS)',
    'Assistente de IA',
    'Relatórios Avançados',
    'Funil de Ofertas Rápidas',
    'Sistema de Pontos',
    'Templates Prontos'
  ];

  const testimonials = [
    {
      name: 'Juliana R.',
      location: 'Orlando, FL',
      text: 'Eu anotava tudo no papel e esquecia clientes. Agora minha agenda está cheia e tudo organizado.',
      rating: 5
    },
    {
      name: 'Maria S.',
      location: 'Miami, FL', 
      text: 'As campanhas automáticas me trouxeram 15 novos clientes em um mês!',
      rating: 5
    },
    {
      name: 'Ana C.',
      location: 'Houston, TX',
      text: 'O assistente de IA me ajuda a responder clientes mais rápido. Economizo 2 horas por dia!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/Orange and Dark Gray Retro Apparel Logo.png" 
              alt="Boss Maids Pro" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-pink-400">Boss Maids Pro</h1>
              <p className="text-xs text-gray-300">Sistema Profissional para Limpeza</p>
            </div>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Entrar
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-pink-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Organize, automatize e 
            <span className="text-pink-600"> multiplique seus clientes</span> de limpeza
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Tudo em um só lugar!
          </p>
          
          <p className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
            O Boss Maids Pro foi criado para limpadoras nos EUA que querem mais clientes, 
            mais organização e mais tempo livre.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onGetStarted}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>📲 Teste Grátis por 7 Dias</span>
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Check className="text-green-500" size={16} />
              <span>7 dias grátis</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="text-green-500" size={16} />
              <span>Suporte em português</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="text-green-500" size={16} />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problems & Solutions */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Pare de Perder Dinheiro por Desorganização
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-red-600 mb-4">❌ Problemas Comuns:</h3>
              <div className="space-y-3">
                <p className="text-gray-700">• Agenda no papel = clientes esquecidos</p>
                <p className="text-gray-700">• Mensagens manuais = tempo perdido</p>
                <p className="text-gray-700">• Falta de marketing = agenda vazia</p>
                <p className="text-gray-700">• Sem controle financeiro = prejuízo</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-green-600 mb-4">✅ Com Boss Maids Pro:</h3>
              <div className="space-y-3">
                <p className="text-gray-700">• Agenda digital sempre organizada</p>
                <p className="text-gray-700">• Campanhas automáticas que funcionam</p>
                <p className="text-gray-700">• Marketing profissional integrado</p>
                <p className="text-gray-700">• Relatórios completos de faturamento</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Comece grátis e cresça conforme sua necessidade
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Básico */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano Básico</h3>
                <div className="text-4xl font-bold text-pink-600 mb-2">$19.90</div>
                <p className="text-gray-600">/mês</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {basicFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="text-green-500 mr-3 flex-shrink-0" size={16} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={onGetStarted}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Começar Teste Grátis
              </button>
            </div>

            {/* Plano Premium */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-xl p-8 text-white relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center">
                  <Crown size={16} className="mr-1" />
                  MAIS POPULAR
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Plano Premium</h3>
                <div className="text-4xl font-bold mb-2">$47</div>
                <p className="text-pink-100">/mês</p>
              </div>
              
              <div className="mb-4">
                <p className="text-pink-100 text-sm mb-3">Tudo do Básico +</p>
                <ul className="space-y-3 mb-8">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="text-yellow-300 mr-3 flex-shrink-0" size={16} />
                      <span className="text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={onGetStarted}
                className="w-full bg-white text-pink-600 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Quero Crescer - Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-pink-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            O Que Nossas Clientes Dizem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="text-center">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronta para Multiplicar Seus Clientes?
          </h2>
          <p className="text-xl mb-8 text-pink-100">
            Junte-se a centenas de limpadoras que já transformaram seus negócios
          </p>
          
          <button
            onClick={onGetStarted}
            className="bg-white text-pink-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <span>Começar Meu Teste Grátis Agora</span>
            <ArrowRight size={20} />
          </button>
          
          <p className="text-pink-200 text-sm mt-4">
            7 dias grátis • Sem compromisso • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img 
              src="/Orange and Dark Gray Retro Apparel Logo.png" 
              alt="Boss Maids Pro" 
              className="w-12 h-12"
            />
            <div>
              <h3 className="text-2xl font-bold text-pink-400">Boss Maids Pro™</h3>
              <p className="text-gray-300">Feito por quem entende de limpeza</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-2">Suporte</h4>
              <p className="text-gray-300">📧 Suporte por e-mail</p>
              <p className="text-gray-300">📱 SMS notificações</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Empresa</h4>
              <p className="text-gray-300">Sobre nós</p>
              <p className="text-gray-300">Termos de uso</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Recursos</h4>
              <p className="text-gray-300">Blog</p>
              <p className="text-gray-300">Tutoriais</p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-400">
              © 2024 Boss Maids Pro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
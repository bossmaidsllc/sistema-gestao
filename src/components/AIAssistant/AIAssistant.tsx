import React, { useState } from 'react';
import { Send, Bot, User, MessageCircle, Lightbulb, TrendingUp, Users, DollarSign, MapPin, Home, Calculator, Sparkles } from 'lucide-react';
import { aiAdapter } from '../../lib/adapters/aiAdapter';
import { useAuth } from '../../hooks/useAuth';

export default function AIAssistant() {
  const { demoMode } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: `👋 Olá! Sou a Marianna, sua assistente especializada em limpeza! 🧽✨\n\n${demoMode ? '🎭 MODO DEMO ATIVO - Respostas simuladas\n\n' : ''}Sou uma profissional experiente que conhece tudo sobre:\n• Precificação por região e tipo de casa\n• Técnicas de limpeza profissional\n• Marketing para empresas de limpeza\n• Gestão de clientes e leads\n\nComo posso ajudar você hoje?`,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPriceCalculator, setShowPriceCalculator] = useState(false);
  const [houseData, setHouseData] = useState({
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    cleaningType: 'regular',
    frequency: 'weekly',
    city: 'Miami',
    state: 'FL'
  });

  const quickQuestions = [
    {
      icon: Calculator,
      title: 'Calculadora de Preços',
      question: 'Calcular preço baseado na casa e localização'
    },
    {
      icon: Users,
      title: 'Conquistar Clientes',
      question: 'Quais são as melhores estratégias para conseguir novos clientes?'
    },
    {
      icon: TrendingUp,
      title: 'Marketing Local',
      question: 'Como fazer marketing local para minha empresa de limpeza?'
    },
    {
      icon: MessageCircle,
      title: 'Atendimento',
      question: 'Como responder leads de forma mais eficaz?'
    },
    {
      icon: Home,
      title: 'Técnicas de Limpeza',
      question: 'Quais são as melhores técnicas para deep cleaning?'
    },
    {
      icon: Lightbulb,
      title: 'Dicas Profissionais',
      question: 'Dicas para ser mais eficiente nas limpezas'
    }
  ];

  const aiResponses = {
    'calculadora': 'Vou calcular o preço ideal para você! Com base nos dados da casa, vou considerar: localização, tamanho, tipo de limpeza e frequência. Isso me ajuda a dar um preço competitivo para sua região.',
    
    'precificação': 'Para precificar seus serviços, considere: 1) Calcule seus custos (produtos, transporte, tempo) 2) Pesquise a concorrência local 3) Adicione sua margem de lucro (30-50%) 4) Considere diferentes preços por tipo de limpeza: Regular ($80-120), Deep Clean ($150-250), Move In-Out ($200-350).',
    
    'clientes': 'Estratégias eficazes: 1) Google My Business otimizado 2) Parcerias com corretores e administradoras 3) Marketing boca a boca com programa de indicações 4) Presença no Facebook e Instagram 5) Flyers em condomínios 6) Ofereça primeira limpeza com desconto.',
    
    'marketing': 'Marketing local eficaz: 1) Google Ads para "limpeza + sua cidade" 2) Posts no Facebook mostrando antes/depois 3) Stories no Instagram com dia a dia 4) Parcerias com businesses locais 5) Avaliações no Google 6) Networking em grupos de mulheres empreendedoras.',
    
    'atendimento': 'Para converter mais leads: 1) Responda em até 5 minutos 2) Faça perguntas específicas sobre a casa 3) Envie fotos de trabalhos anteriores 4) Ofereça orçamento detalhado 5) Tenha flexibilidade de horários 6) Mostre diferenciais (seguro, produtos eco-friendly).',
    
    'tecnicas': 'Para deep cleaning profissional: 1) Sempre comece de cima para baixo 2) Use produtos específicos para cada superfície 3) Microfiber cloths são essenciais 4) Deixe produtos químicos agirem antes de limpar 5) Organize um kit com todos os produtos 6) Cronometre cada ambiente para ser mais eficiente.',
    
    'dicas': 'Dicas para ser mais eficiente: 1) Crie uma checklist para cada tipo de limpeza 2) Invista em equipamentos de qualidade 3) Use carrinho organizador 4) Trabalhe sempre no mesmo padrão 5) Ouça música ou podcasts 6) Tire fotos antes/depois para mostrar seu trabalho.'
  };

  const calculatePrice = () => {
    const basePrices = {
      regular: 80,
      deep: 150,
      movein: 200,
      airbnb: 60,
      office: 120
    };
    
    const locationMultipliers = {
      'Miami-FL': 1.2,
      'Los Angeles-CA': 1.4,
      'New York-NY': 1.5,
      'Houston-TX': 1.0,
      'Phoenix-AZ': 0.9
    };
    
    const basePrice = basePrices[houseData.cleaningType as keyof typeof basePrices] || 80;
    const locationKey = `${houseData.city}-${houseData.state}` as keyof typeof locationMultipliers;
    const locationMultiplier = locationMultipliers[locationKey] || 1.0;
    
    // Size calculation
    const sizeMultiplier = (houseData.bedrooms * 0.15) + (houseData.bathrooms * 0.1) + (houseData.squareFeet / 1000 * 0.2);
    
    // Frequency discount
    const frequencyDiscounts = {
      weekly: 0.15,
      biweekly: 0.10,
      monthly: 0.05,
      onetime: 0
    };
    
    const discount = frequencyDiscounts[houseData.frequency as keyof typeof frequencyDiscounts] || 0;
    
    const subtotal = basePrice * locationMultiplier * (1 + sizeMultiplier);
    const total = Math.round(subtotal * (1 - discount));
    
    return {
      basePrice,
      locationMultiplier,
      sizeMultiplier,
      discount,
      total
    };
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Call real AI API
    callAIAPI(newMessage);
  };

  const callAIAPI = async (message: string) => {
    try {
      const { success, message: aiMessage } = await aiAdapter.chatCompletion(message, {
        experience: 'cleaning_business',
        location: 'USA'
      });

      const aiResponse = {
        id: Date.now().toString(),
        type: 'ai',
        content: aiMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Error:', error);
      
      const errorMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `Desculpe, estou com problemas técnicos no momento${demoMode ? ' (modo demo ativo)' : ''}. Tente novamente em alguns minutos! 😅`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }

    setNewMessage('');
  };

  const handleQuickQuestion = (question: string) => {
    if (question.includes('Calcular preço')) {
      setShowPriceCalculator(true);
      const calculatorMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: 'Quero calcular o preço baseado na casa e localização',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, calculatorMessage]);
      
      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponses.calculadora,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    } else {
      setNewMessage(question);
    }
  };

  const handlePriceCalculation = () => {
    const calculation = calculatePrice();
    const response = `💰 **Cálculo de Preço Personalizado**\n\n🏠 **Detalhes da Casa:**\n• ${houseData.bedrooms} quartos, ${houseData.bathrooms} banheiros\n• ${houseData.squareFeet} sq ft\n• ${houseData.city}, ${houseData.state}\n\n💵 **Breakdown do Preço:**\n• Preço base: $${calculation.basePrice}\n• Ajuste por localização: ${(calculation.locationMultiplier * 100).toFixed(0)}%\n• Ajuste por tamanho: +${(calculation.sizeMultiplier * 100).toFixed(0)}%\n• Desconto frequência: -${(calculation.discount * 100).toFixed(0)}%\n\n✨ **Preço Final Recomendado: $${calculation.total}**\n\nEsse preço está competitivo para sua região e tipo de serviço!`;
    
    const aiMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setShowPriceCalculator(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            <Sparkles className="text-white" size={32} />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Sparkles className="text-pink-500" size={12} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Marianna - Especialista em Limpeza</h2>
          <p className="text-gray-600">Profissional com 10+ anos de experiência • IA Avançada • Disponível 24/7</p>
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && !showPriceCalculator && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {quickQuestions.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(item.question)}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-left border-l-4 border-pink-500"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <Icon className="text-pink-600" size={18} />
                    </div>
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{item.question}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Price Calculator */}
        {showPriceCalculator && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calculator className="mr-2 text-pink-500" size={24} />
              Calculadora de Preços Inteligente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={houseData.bedrooms}
                      onChange={(e) => setHouseData({...houseData, bedrooms: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={houseData.bathrooms}
                      onChange={(e) => setHouseData({...houseData, bathrooms: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metragem (sq ft)</label>
                  <input
                    type="number"
                    min="500"
                    max="10000"
                    step="100"
                    value={houseData.squareFeet}
                    onChange={(e) => setHouseData({...houseData, squareFeet: parseInt(e.target.value) || 1000})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Limpeza</label>
                  <select
                    value={houseData.cleaningType}
                    onChange={(e) => setHouseData({...houseData, cleaningType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="regular">Regular Cleaning</option>
                    <option value="deep">Deep Cleaning</option>
                    <option value="movein">Move In/Out</option>
                    <option value="airbnb">Airbnb Turnover</option>
                    <option value="office">Office Cleaning</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
                  <select
                    value={houseData.frequency}
                    onChange={(e) => setHouseData({...houseData, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="weekly">Semanal (-15%)</option>
                    <option value="biweekly">Quinzenal (-10%)</option>
                    <option value="monthly">Mensal (-5%)</option>
                    <option value="onetime">Uma vez</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={houseData.city}
                      onChange={(e) => setHouseData({...houseData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      value={houseData.state}
                      onChange={(e) => setHouseData({...houseData, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="FL">Florida</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                      <option value="AZ">Arizona</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-medium text-pink-800 mb-2">Preço Estimado</h4>
                  <p className="text-3xl font-bold text-pink-600">${calculatePrice().total}</p>
                  <p className="text-sm text-pink-700">Baseado na sua região e especificações</p>
                </div>
                
                <button
                  onClick={handlePriceCalculation}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Gerar Análise Detalhada
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-xs lg:max-w-md ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-pink-500 ml-2' : 'bg-gray-300 mr-2'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <User className="text-white" size={18} />
                    ) : (
                      <Sparkles className="text-gray-600" size={16} />
                    )}
                  </div>
                  
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-pink-200' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                    <Sparkles className="text-gray-600" size={16} />
                  </div>
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Pergunte um preço para Deep Clean 2/2 com cozinha suja..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Calculator className="text-pink-500 mx-auto mb-2" size={24} />
            <h3 className="font-semibold text-gray-800">Calculadora Inteligente</h3>
            <p className="text-sm text-gray-600">Preços baseados em localização e casa</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Lightbulb className="text-yellow-500 mx-auto mb-2" size={24} />
            <h3 className="font-semibold text-gray-800">Técnicas Profissionais</h3>
            <p className="text-sm text-gray-600">10+ anos de experiência em limpeza</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <TrendingUp className="text-green-500 mx-auto mb-2" size={24} />
            <h3 className="font-semibold text-gray-800">Marketing & Vendas</h3>
            <p className="text-sm text-gray-600">Estratégias para crescer seu negócio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
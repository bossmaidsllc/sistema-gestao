import React, { useState, useEffect, useRef } from 'react';
import { Send, X, CheckCircle, Clock, Sparkles, ArrowRight } from 'lucide-react';

interface WhatsAppOnboardingProps {
  onClose: () => void;
  onComplete: (data: any) => void;
}

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface QuizStep {
  question: string;
  type: 'text' | 'options';
  options?: string[];
  key: string;
  placeholder?: string;
  copywritingHook?: string;
}

export default function WhatsAppOnboarding({ onClose, onComplete }: WhatsAppOnboardingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any>({});
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showFinalCTA, setShowFinalCTA] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const quizSteps: QuizStep[] = [
    {
      question: "Oi! 👋 Sou a Marianna, especialista em limpeza com mais de 10 anos nos EUA!\n\nVou te fazer algumas perguntinhas rápidas para criar um plano PERSONALIZADO que vai TRANSFORMAR seu negócio! 🚀\n\nPrimeiro... qual é o seu nome?",
      type: "text",
      key: "name",
      placeholder: "Digite seu nome...",
      copywritingHook: "Personalização é tudo!"
    },
    {
      question: "Que nome lindo! 😍\n\nEm qual cidade você trabalha? (Isso é SUPER importante para calcular seus preços corretos!)",
      type: "text", 
      key: "location",
      placeholder: "Ex: Miami, Orlando, Tampa...",
      copywritingHook: "Localização = Preços Corretos = Mais Lucro"
    },
    {
      question: "Perfeita! Agora me conta... há quanto tempo você trabalha com limpeza?\n\n(Isso vai me ajudar a saber EXATAMENTE como te ajudar! 🎯)",
      type: "options",
      options: ["🆕 Menos de 1 ano", "💪 1-2 anos", "🔥 3-5 anos", "👑 Mais de 5 anos"],
      key: "experience",
      copywritingHook: "Cada nível tem estratégias específicas"
    },
    {
      question: "Que experiência incrível! 🌟\n\nQuantos clientes FIXOS você tem hoje? (Seja honesta, sem julgamento! 😊)",
      type: "options",
      options: ["😔 0-5 clientes", "😊 6-15 clientes", "🔥 16-30 clientes", "👑 Mais de 30"],
      key: "clients",
      copywritingHook: "Vou te mostrar como MULTIPLICAR isso!"
    },
    {
      question: "Agora a pergunta de OURO... 💰\n\nQual é o seu MAIOR desafio hoje? (Essa resposta vai definir seu plano de crescimento!)",
      type: "options",
      options: ["😰 Conseguir mais clientes", "📅 Organizar minha agenda", "💸 Calcular preços corretos", "📱 Fazer marketing que funciona"],
      key: "challenge",
      copywritingHook: "Vou resolver isso para você!"
    },
    {
      question: "PERFEITO! Já sei exatamente como te ajudar! 🎯\n\nÚltima pergunta... qual é o seu SONHO para os próximos 3 meses?",
      type: "options",
      options: ["💰 Dobrar meu faturamento", "📅 Ter agenda sempre cheia", "⏰ Trabalhar menos horas", "👥 Contratar uma ajudante"],
      key: "goal",
      copywritingHook: "Vamos tornar isso realidade!"
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    // Iniciar com a primeira pergunta após um delay
    setTimeout(() => {
      addAIMessage(quizSteps[0].question);
    }, 1500);
  }, []);

  const addAIMessage = (content: string) => {
    setIsTyping(true);
    setShowInput(false);
    setShowOptions(false);
    
    // Simular tempo de digitação baseado no tamanho da mensagem
    const typingTime = Math.min(Math.max(content.length * 30, 2000), 4000);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const newMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Mostrar input ou opções após a mensagem
      setTimeout(() => {
        const currentQuiz = quizSteps[currentStep];
        if (currentQuiz?.type === 'text') {
          setShowInput(true);
        } else if (currentQuiz?.type === 'options') {
          setShowOptions(true);
        }
      }, 800);
    }, typingTime);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    // Adicionar resposta do usuário
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: textInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowInput(false);
    
    // Salvar resposta
    const currentQuiz = quizSteps[currentStep];
    setUserAnswers(prev => ({
      ...prev,
      [currentQuiz.key]: textInput
    }));

    setTextInput('');
    nextStep();
  };

  const handleOptionClick = (option: string) => {
    // Adicionar resposta do usuário
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: option,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowOptions(false);
    
    // Salvar resposta
    const currentQuiz = quizSteps[currentStep];
    setUserAnswers(prev => ({
      ...prev,
      [currentQuiz.key]: option
    }));

    nextStep();
  };

  const nextStep = () => {
    const nextStepIndex = currentStep + 1;
    
    if (nextStepIndex < quizSteps.length) {
      setCurrentStep(nextStepIndex);
      setTimeout(() => {
        addAIMessage(quizSteps[nextStepIndex].question);
      }, 1500);
    } else {
      // Quiz finalizado - mostrar análise personalizada
      setTimeout(() => {
        showPersonalizedAnalysis();
      }, 1500);
    }
  };

  const showPersonalizedAnalysis = () => {
    const name = userAnswers.name || 'querida';
    const location = userAnswers.location || 'sua cidade';
    const challenge = userAnswers.challenge || '';
    const goal = userAnswers.goal || '';
    const experience = userAnswers.experience || '';
    const clients = userAnswers.clients || '';
    
    // Análise personalizada baseada nas respostas
    let analysis = `${name}, acabei de analisar suas respostas e tenho uma NOTÍCIA INCRÍVEL! 🎉\n\n`;
    
    // Análise baseada na experiência
    if (experience.includes('Menos de 1 ano')) {
      analysis += `Como você está começando, vou te ensinar os SEGREDOS que levei anos para descobrir! 🔥\n\n`;
    } else if (experience.includes('Mais de 5 anos')) {
      analysis += `Com sua experiência, você está PERDENDO DINHEIRO sem um sistema profissional! 💸\n\n`;
    } else {
      analysis += `Você está no momento PERFEITO para dar o próximo passo! 🚀\n\n`;
    }
    
    // Análise baseada no número de clientes
    if (clients.includes('0-5')) {
      analysis += `📈 Vou te mostrar como sair de ${clients.split(' ')[1]} para 20+ clientes em 60 dias!\n\n`;
    } else if (clients.includes('Mais de 30')) {
      analysis += `👑 Com tantos clientes, você PRECISA de organização profissional urgente!\n\n`;
    } else {
      analysis += `💪 Você já tem uma base boa, agora vamos MULTIPLICAR isso!\n\n`;
    }
    
    // Solução baseada no desafio
    if (challenge.includes('Conseguir mais clientes')) {
      analysis += `🎯 SEU PROBLEMA: Falta de clientes\n✅ MINHA SOLUÇÃO: Sistema de leads automático que traz 5-10 clientes novos por semana!\n\n`;
    } else if (challenge.includes('Organizar')) {
      analysis += `🎯 SEU PROBLEMA: Desorganização\n✅ MINHA SOLUÇÃO: Agenda inteligente que nunca esquece um cliente!\n\n`;
    } else if (challenge.includes('preços')) {
      analysis += `🎯 SEU PROBLEMA: Preços errados\n✅ MINHA SOLUÇÃO: Calculadora que define o preço EXATO para ${location}!\n\n`;
    } else {
      analysis += `🎯 SEU PROBLEMA: Marketing que não funciona\n✅ MINHA SOLUÇÃO: Campanhas automáticas que REALMENTE trazem clientes!\n\n`;
    }
    
    analysis += `🔥 RESULTADO GARANTIDO:\n`;
    
    if (goal.includes('Dobrar')) {
      analysis += `• Dobrar seu faturamento em 90 dias\n`;
    } else if (goal.includes('agenda cheia')) {
      analysis += `• Agenda 100% ocupada em 30 dias\n`;
    } else if (goal.includes('menos horas')) {
      analysis += `• Trabalhar 50% menos e ganhar mais\n`;
    } else {
      analysis += `• Crescer até precisar contratar ajuda\n`;
    }
    
    analysis += `• Clientes pagando em dia\n• Marketing automático funcionando\n• Você sendo a BOSS da sua área! 👑\n\n`;
    analysis += `${name}, você está a 1 CLIQUE de transformar sua vida! 🚀\n\nClica no botão abaixo e vamos começar AGORA:`;
    
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const newMessage: Message = {
        id: `ai-analysis-${Date.now()}`,
        type: 'ai',
        content: analysis,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Mostrar CTA final após a análise
      setTimeout(() => {
        setShowFinalCTA(true);
      }, 1000);
    }, 3000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleStartTrial = () => {
    onComplete(userAnswers);
  };

  const currentQuiz = quizSteps[currentStep] || null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md h-[95vh] sm:h-[600px] flex flex-col shadow-2xl">
        {/* Header estilo WhatsApp */}
        <div className="bg-green-600 p-3 sm:p-4 rounded-t-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white">
                <img 
                  src="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1" 
                  alt="Marianna - Especialista em Limpeza"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Marianna Silva</h3>
                <div className="flex items-center space-x-1 text-green-100">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-xs">online agora</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5ddd5' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: '#e5ddd5'
          }}
        >
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'ai' && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-md px-3 sm:px-4 py-2 sm:py-3 max-w-[85%] sm:max-w-xs shadow-sm border">
                    <p className="text-gray-800 text-sm sm:text-base whitespace-pre-line leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      <CheckCircle className="text-blue-500" size={12} />
                    </div>
                  </div>
                </div>
              )}
              
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="bg-green-500 text-white rounded-2xl rounded-br-md px-3 sm:px-4 py-2 sm:py-3 max-w-[85%] sm:max-w-xs shadow-sm">
                    <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-end mt-2 space-x-1">
                      <span className="text-xs text-green-100">{formatTime(message.timestamp)}</span>
                      <div className="flex">
                        <CheckCircle className="text-green-200" size={12} />
                        <CheckCircle className="text-green-200 -ml-1" size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md px-3 sm:px-4 py-3 shadow-sm border">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500">Marianna está digitando...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-gray-100 border-t border-gray-200 rounded-b-2xl">
          {showInput && currentQuiz?.type === 'text' ? (
            <form onSubmit={handleTextSubmit} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={currentQuiz.placeholder}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base border border-gray-300"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="p-2 sm:p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
              >
                <Send size={16} className="sm:w-5 sm:h-5" />
              </button>
            </form>
          ) : showOptions && currentQuiz?.type === 'options' ? (
            <div className="space-y-2">
              {currentQuiz.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="w-full bg-white hover:bg-green-50 text-gray-800 hover:text-green-800 py-3 sm:py-4 px-3 sm:px-4 rounded-xl font-medium transition-all text-left border-2 border-gray-200 hover:border-green-300 text-sm sm:text-base shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : showFinalCTA ? (
            <div className="space-y-3">
              <button
                onClick={handleStartTrial}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Sparkles size={18} />
                <span>🚀 SIM! Quero Transformar Meu Negócio</span>
              </button>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">
                  ✅ 7 dias grátis • ✅ Sem cartão • ✅ Cancele quando quiser
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                  <span className="flex items-center">
                    <CheckCircle size={12} className="mr-1 text-green-500" />
                    Seguro
                  </span>
                  <span className="flex items-center">
                    <CheckCircle size={12} className="mr-1 text-green-500" />
                    Sem compromisso
                  </span>
                  <span className="flex items-center">
                    <CheckCircle size={12} className="mr-1 text-green-500" />
                    Suporte 24/7
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 text-xs sm:text-sm py-2 flex items-center justify-center space-x-2">
              {isTyping ? (
                <>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span>Marianna está digitando...</span>
                </>
              ) : (
                <span>Aguardando sua resposta...</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
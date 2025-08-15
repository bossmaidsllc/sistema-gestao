import { isDemoMode, hasOpenAI } from './index';

const DEMO_AI_RESPONSES = {
  pricing: 'Com base na sua região (Miami, FL) e no tipo de casa (3 quartos, 2 banheiros), recomendo cobrar $150 para Deep Clean. Considere: localização premium (+20%), tamanho da casa (padrão), frequência semanal (-15% desconto). Preço final competitivo: $150.',
  
  marketing: 'Para conseguir mais clientes em Miami: 1) Otimize seu Google My Business, 2) Poste fotos antes/depois no Instagram, 3) Faça parcerias com corretores locais, 4) Ofereça desconto para primeira limpeza, 5) Peça avaliações no Google. Foque em bairros de classe média-alta.',
  
  response: 'Para responder esse lead: "Oi [Nome]! Obrigada pelo interesse. Trabalho com limpeza há [X] anos em Miami e tenho ótimas avaliações. Posso fazer uma visita gratuita para orçamento? Quando seria melhor para você?" Seja rápida - leads respondem melhor em até 5 minutos!',
  
  default: 'Olá! Sou Marianna, sua assistente especializada em limpeza. Posso ajudar com precificação, marketing, atendimento a clientes e técnicas de limpeza. Como posso ajudar você hoje? (Modo demo ativo - respostas simuladas)'
};

class DemoAiAdapter {
  async chatCompletion(message: string, userContext?: any) {
    if (isDemoMode() || !hasOpenAI()) {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const lowerMessage = message.toLowerCase();
      
      let response = DEMO_AI_RESPONSES.default;
      
      if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('cobrar')) {
        response = DEMO_AI_RESPONSES.pricing;
      } else if (lowerMessage.includes('marketing') || lowerMessage.includes('cliente') || lowerMessage.includes('divulgar')) {
        response = DEMO_AI_RESPONSES.marketing;
      } else if (lowerMessage.includes('responder') || lowerMessage.includes('lead') || lowerMessage.includes('atendimento')) {
        response = DEMO_AI_RESPONSES.response;
      }
      
      console.log('🤖 DEMO AI RESPOSTA:', { message, response });
      
      return { success: true, message: response };
    }
    
    // Implementação real do OpenAI seria aqui
    throw new Error('OpenAI não configurado');
  }
}

export const aiAdapter = new DemoAiAdapter();
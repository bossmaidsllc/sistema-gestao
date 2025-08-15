import React from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import WhatsAppButton from '../WhatsApp/WhatsAppButton';

export default function PostCheckout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <WhatsAppButton />
      
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Pagamento Confirmado! 🎉
          </h1>
          
          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            Sua assinatura foi ativada com sucesso. Agora você precisa criar sua senha para acessar o sistema.
          </p>

          {/* Email Instructions */}
          <div className="bg-blue-50 rounded-xl p-4 sm:p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Mail className="text-white" size={20} />
              </div>
            </div>
            
            <h3 className="font-bold text-blue-800 mb-2 text-sm sm:text-base">Verifique seu e-mail</h3>
            <p className="text-blue-700 text-xs sm:text-sm">
              Enviamos um link para você criar sua senha e acessar o Boss Maids Pro. 
              Verifique sua caixa de entrada e spam.
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center text-left">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">
                1
              </div>
              <span className="text-gray-700 text-sm sm:text-base">Verifique seu e-mail</span>
            </div>
            
            <div className="flex items-center text-left">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">
                2
              </div>
              <span className="text-gray-700 text-sm sm:text-base">Clique no link para criar sua senha</span>
            </div>
            
            <div className="flex items-center text-left">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">
                3
              </div>
              <span className="text-gray-700 text-sm sm:text-base">Acesse o sistema e comece a usar!</span>
            </div>
          </div>

          {/* Support */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
            <h4 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Precisa de ajuda?</h4>
            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              Nossa equipe está pronta para ajudar você a começar
            </p>
            <a
              href="https://wa.me/17745783942?text=Acabei%20de%20assinar%20e%20preciso%20de%20ajuda"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              <span>Falar no WhatsApp</span>
              <ArrowRight size={16} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
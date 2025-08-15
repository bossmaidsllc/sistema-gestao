import React, { useState } from 'react';
import { createCheckoutSession } from '../../lib/stripe';
import { isDemoMode } from '../../lib/adapters';

interface CheckoutButtonProps {
  plan: 'basic' | 'premium';
  children: React.ReactNode;
  className?: string;
  userEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export default function CheckoutButton({ 
  plan, 
  children, 
  className, 
  userEmail,
  successUrl,
  cancelUrl 
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const demoMode = isDemoMode();

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      const { url } = await createCheckoutSession(
        plan, 
        userEmail, 
        successUrl, 
        cancelUrl
      );
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert(`Erro ao processar pagamento${demoMode ? ' (modo demo)' : ''}. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span>Processando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
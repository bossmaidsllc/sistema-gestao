import { loadStripe } from '@stripe/stripe-js';
import { isDemoMode, hasStripe } from './adapters';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const getStripe = () => stripePromise;

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY,
  priceIds: {
    basic: import.meta.env.VITE_STRIPE_PRICE_ID_BASIC,
    premium: import.meta.env.VITE_STRIPE_PRICE_ID_PREMIUM
  },
  webhookSecret: import.meta.env.VITE_STRIPE_WEBHOOK_SECRET
};

// Price configurations
export const PLANS = {
  basic: {
    name: 'Boss Maids Pro Básico',
    price: 19.90,
    priceId: STRIPE_CONFIG.priceIds.basic,
    features: [
      'Agenda Digital Completa',
      'Cadastro de Clientes',
      'Orçamentos Automáticos',
      'Controle Financeiro',
      'Notificações por SMS',
      'Fotos Antes/Depois',
      'Relatórios Básicos',
      'Suporte em Português'
    ]
  },
  premium: {
    name: 'Boss Maids Pro Premium',
    price: 47,
    priceId: STRIPE_CONFIG.priceIds.premium,
    features: [
      'Tudo do Plano Básico',
      'Assistente de IA Sofia',
      'Marketing Automático',
      'Campanhas por Email/SMS',
      'Leads Qualificados',
      'Precificação Inteligente',
      'Cursos Exclusivos',
      'Relatórios Avançados',
      'Suporte Prioritário'
    ]
  }
};

export async function createCheckoutSession(
  plan: 'basic' | 'premium',
  userEmail?: string,
  successUrl?: string,
  cancelUrl?: string
) {
  if (isDemoMode() || !hasStripe()) {
    // Demo mode - simulate successful checkout
    return {
      url: `${window.location.origin}/pos-checkout?demo_checkout=success&plan=${plan}`,
      sessionId: `demo_session_${Date.now()}`
    };
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan,
        userEmail,
        successUrl: successUrl || `${window.location.origin}/pos-checkout?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: cancelUrl || window.location.origin
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url, sessionId } = await response.json();
    return { url, sessionId };
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

export async function createPortalSession(customerId: string) {
  if (isDemoMode() || !hasStripe()) {
    // Demo mode - simulate portal
    alert('Portal de cobrança simulado (modo demo)');
    return { url: window.location.href };
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    return { url };
  } catch (error) {
    console.error('Portal error:', error);
    throw error;
  }
}
import { isDemoMode, hasStripe } from './index';
import { createCheckoutSession as createStripeCheckout, createPortalSession } from '../stripe';

class BillingAdapter {
  async createCheckoutSession(
    plan: 'basic' | 'premium', 
    userEmail?: string,
    successUrl?: string,
    cancelUrl?: string
  ) {
    if (isDemoMode() || !hasStripe()) {
      // Simular checkout bem-sucedido
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simular upgrade do plano
          const demoUser = JSON.parse(localStorage.getItem('demo_user') || '{}');
          demoUser.plan = plan;
          demoUser.subscription_status = 'active';
          demoUser.stripe_customer_id = `demo_customer_${Date.now()}`;
          demoUser.stripe_subscription_id = `demo_sub_${Date.now()}`;
          localStorage.setItem('demo_user', JSON.stringify(demoUser));
          
          resolve({
            url: `${window.location.origin}/app?demo_checkout=success&plan=${plan}`,
            sessionId: 'demo_session_' + Date.now()
          });
        }, 1000);
      });
    }
    
    // Usar integração real do Stripe
    return createStripeCheckout(plan, userEmail, successUrl, cancelUrl);
  }

  async createPortalSession(customerId: string) {
    if (isDemoMode() || !hasStripe()) {
      // Simular portal
      alert('Portal de cobrança simulado (modo demo)');
      return { url: window.location.href };
    }
    
    return createPortalSession(customerId);
  }

  async handleWebhook(event: any) {
    if (isDemoMode()) {
      console.log('Demo: Webhook simulado', event);
      return { success: true };
    }
    
    // Implementação real do webhook seria aqui
    throw new Error('Webhook handling not implemented for production');
  }

  async getSubscriptionStatus(customerId: string) {
    if (isDemoMode()) {
      const demoUser = JSON.parse(localStorage.getItem('demo_user') || '{}');
      return {
        status: demoUser.subscription_status || 'trial',
        plan: demoUser.plan || 'trial',
        trial_days_left: demoUser.trial_days_left || 7
      };
    }
    
    // Implementação real seria aqui
    return {
      status: 'trial',
      plan: 'trial',
      trial_days_left: 7
    };
  }
}

export const billingAdapter = new BillingAdapter();
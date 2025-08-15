import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    
    // Initialize Stripe
    const stripe = (await import('npm:stripe@14.21.0')).default
    const stripeClient = new stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-06-20',
    })

    // Verify webhook signature
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    let event

    try {
      event = stripeClient.webhooks.constructEvent(body, signature!, webhookSecret!)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Webhook signature verification failed', { status: 400 })
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const STRIPE_PRICE_ID_BASIC = Deno.env.get('STRIPE_PRICE_ID_BASIC')
    const STRIPE_PRICE_ID_PREMIUM = Deno.env.get('STRIPE_PRICE_ID_PREMIUM')

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        const plan = session.metadata.plan
        const customerEmail = session.customer_details.email
        
        console.log('Checkout completed:', { plan, customerEmail, customerId: session.customer })
        
        // Update user plan in Supabase
        const { error } = await supabase
          .from('profiles')
          .update({ 
            plan: plan,
            trial_days_left: 7,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            subscription_status: 'active'
          })
          .eq('email', customerEmail)

        if (error) {
          console.error('Error updating user plan:', error)
          throw error
        }

        // Send welcome email with password creation link
        await supabase.functions.invoke('send-email', {
          body: {
            to: customerEmail,
            subject: 'Bem-vinda ao Boss Maids Pro! Crie sua senha',
            html: `
              <h2>Parabéns! Sua assinatura está ativa 🎉</h2>
              <p>Agora você precisa criar sua senha para acessar o sistema:</p>
              <a href="${Deno.env.get('APP_BASE_URL')}/login?email=${encodeURIComponent(customerEmail)}" 
                 style="background: #E91E63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 16px 0;">
                Criar Minha Senha
              </a>
              <p>Qualquer dúvida, fale conosco no WhatsApp!</p>
            `,
            user_id: null
          }
        });

        // Create notification
        await supabase
          .from('notifications')
          .insert({
            user_id: (await supabase.from('profiles').select('id').eq('email', customerEmail).single()).data?.id,
            type: 'billing',
            title: 'Assinatura Ativada!',
            message: `Seu plano ${plan === 'premium' ? 'Premium' : 'Básico'} foi ativado com sucesso`,
            read: false
          })
        break

      case 'customer.subscription.updated':
        const subscription = event.data.object
        const customerId = subscription.customer
        
        // Determine plan based on price ID
        const subscriptionPlan = subscription.items.data[0].price.id === STRIPE_PRICE_ID_PREMIUM ? 'premium' : 'basic'
        
        console.log('Subscription updated:', { customerId, status: subscription.status, plan: subscriptionPlan })
        
        // Update subscription status
        const { error: subError } = await supabase
          .from('profiles')
          .update({ 
            subscription_status: subscription.status,
            plan: subscription.status === 'active' ? subscriptionPlan : 'trial'
          })
          .eq('stripe_customer_id', customerId)

        if (subError) {
          console.error('Error updating subscription:', subError)
          throw subError
        }
        break

      case 'customer.subscription.deleted':
        const deletedSub = event.data.object
        
        console.log('Subscription deleted:', { customerId: deletedSub.customer })
        
        // Revert to trial
        const { error: deleteError } = await supabase
          .from('profiles')
          .update({ 
            plan: 'trial',
            subscription_status: 'canceled',
            trial_days_left: 0
          })
          .eq('stripe_customer_id', deletedSub.customer)

        if (deleteError) {
          console.error('Error handling subscription deletion:', deleteError)
          throw deleteError
        }

        // Create notification
        await supabase
          .from('notifications')
          .insert({
            user_id: (await supabase.from('profiles').select('id').eq('stripe_customer_id', deletedSub.customer).single()).data?.id,
            type: 'billing',
            title: 'Assinatura Cancelada',
            message: 'Sua assinatura foi cancelada. Você ainda pode usar o sistema até o final do período pago.',
            read: false
          })
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        
        console.log('Payment succeeded:', { customerId: invoice.customer, amount: invoice.amount_paid })
        
        // Create payment notification
        await supabase
          .from('notifications')
          .insert({
            user_id: (await supabase.from('profiles').select('id').eq('stripe_customer_id', invoice.customer).single()).data?.id,
            type: 'billing',
            title: 'Pagamento Processado',
            message: `Pagamento de $${(invoice.amount_paid / 100).toFixed(2)} processado com sucesso`,
            read: false
          })
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object
        
        console.log('Payment failed:', { customerId: failedInvoice.customer })
        
        // Create payment failure notification
        await supabase
          .from('notifications')
          .insert({
            user_id: (await supabase.from('profiles').select('id').eq('stripe_customer_id', failedInvoice.customer).single()).data?.id,
            type: 'billing',
            title: 'Falha no Pagamento',
            message: 'Houve um problema com seu pagamento. Verifique seu método de pagamento.',
            read: false
          })
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
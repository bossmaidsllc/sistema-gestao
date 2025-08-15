
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plan, userEmail, successUrl, cancelUrl } = await req.json()
    
    // Initialize Stripe
    const stripe = (await import('npm:stripe@14.21.0')).default
    const stripeClient = new stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-06-20',
    })
    
    const STRIPE_PRICE_ID_BASIC = Deno.env.get('STRIPE_PRICE_ID_BASIC')
    const STRIPE_PRICE_ID_PREMIUM = Deno.env.get('STRIPE_PRICE_ID_PREMIUM')
    const APP_BASE_URL = Deno.env.get('APP_BASE_URL') || 'http://localhost:5173'
    
    const priceId = plan === 'basic' ? STRIPE_PRICE_ID_BASIC : STRIPE_PRICE_ID_PREMIUM
    
    if (!priceId) {
      throw new Error(`Price ID not configured for plan: ${plan}`)
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${APP_BASE_URL}/app?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || APP_BASE_URL,
      customer_email: userEmail,
      subscription_data: {
        trial_period_days: 7,
      },
      metadata: {
        plan: plan,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      automatic_tax: {
        enabled: true,
      },
    })
    
    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Checkout error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
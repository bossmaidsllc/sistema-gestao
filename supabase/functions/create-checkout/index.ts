import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plan, userEmail } = await req.json()
    
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    const STRIPE_PRICE_ID_BASIC = Deno.env.get('STRIPE_PRICE_ID_BASIC')
    const STRIPE_PRICE_ID_PREMIUM = Deno.env.get('STRIPE_PRICE_ID_PREMIUM')
    const APP_BASE_URL = Deno.env.get('APP_BASE_URL') || 'http://localhost:5173'
    
    const priceId = plan === 'basic' ? STRIPE_PRICE_ID_BASIC : STRIPE_PRICE_ID_PREMIUM
    
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': '1',
        'mode': 'subscription',
        'success_url': `${APP_BASE_URL}/app?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${APP_BASE_URL}/`,
        'subscription_data[trial_period_days]': '7',
        ...(userEmail && { 'customer_email': userEmail }),
        'metadata[plan]': plan,
        'allow_promotion_codes': 'true',
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Stripe API error: ${error}`)
    }

    const session = await response.json()
    
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
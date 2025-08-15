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
    const { message, user_context } = await req.json()
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

    const systemPrompt = `Você é Sofia, uma especialista em limpeza residencial com mais de 10 anos de experiência nos EUA. 
    Você ajuda mulheres que trabalham com limpeza a crescer seus negócios, precificar serviços, conquistar clientes e se organizar.
    
    Seja sempre amigável, prática e dê conselhos específicos. Use emojis quando apropriado.
    
    Contexto do usuário: ${JSON.stringify(user_context)}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    if (data.choices && data.choices[0]) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: data.choices[0].message.content 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error('No response from OpenAI')
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
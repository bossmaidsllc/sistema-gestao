// Detecção automática de modo demo
export const isDemoMode = () => {
  const requiredEnvs = [
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  ];
  
  return !requiredEnvs.every(env => env && env.length > 0);
};

export const hasStripe = () => {
  return !!(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && 
           import.meta.env.VITE_STRIPE_SECRET_KEY && 
           import.meta.env.VITE_STRIPE_PRICE_ID_BASIC && 
           import.meta.env.VITE_STRIPE_PRICE_ID_PREMIUM);
};

export const hasSendGrid = () => {
  return !!import.meta.env.VITE_SENDGRID_API_KEY;
};

export const hasTwilio = () => {
  return !!(import.meta.env.VITE_TWILIO_ACCOUNT_SID && 
           import.meta.env.VITE_TWILIO_AUTH_TOKEN && 
           import.meta.env.VITE_TWILIO_PHONE_NUMBER);
};

export const hasOpenAI = () => {
  return !!import.meta.env.VITE_OPENAI_API_KEY;
};

export const hasGooglePlaces = () => {
  return !!import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
};

export const getIntegrationStatus = () => {
  return {
    supabase: !isDemoMode(),
    stripe: hasStripe(),
    sendgrid: hasSendGrid(),
    twilio: hasTwilio(),
    openai: hasOpenAI(),
    googlePlaces: hasGooglePlaces(),
    demoMode: isDemoMode()
  };
};
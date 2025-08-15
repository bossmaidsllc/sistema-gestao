import { isDemoMode, hasTwilio } from './index';

class DemoSmsAdapter {
  async sendSMS(to: string, message: string, userId?: string) {
    if (isDemoMode() || !hasTwilio()) {
      console.log('📱 DEMO SMS ENVIADO:', {
        to,
        message,
        timestamp: new Date().toISOString()
      });
      
      // Simular log no banco local
      const logs = JSON.parse(localStorage.getItem('demo_sms_logs') || '[]');
      logs.push({
        id: Date.now().toString(),
        user_id: userId,
        to_phone: to,
        message,
        status: 'sent',
        sent_at: new Date().toISOString()
      });
      localStorage.setItem('demo_sms_logs', JSON.stringify(logs));
      
      return { success: true, message: 'SMS enviado (modo demo)', sid: 'demo_' + Date.now() };
    }
    
    // Implementação real do Twilio seria aqui
    throw new Error('Twilio não configurado');
  }

  async getSmsLogs(userId: string) {
    if (isDemoMode()) {
      const logs = JSON.parse(localStorage.getItem('demo_sms_logs') || '[]');
      return logs.filter((log: any) => log.user_id === userId);
    }
    
    return [];
  }
}

export const smsAdapter = new DemoSmsAdapter();
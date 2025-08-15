import { isDemoMode, hasSendGrid } from './index';

class DemoEmailAdapter {
  async sendEmail(to: string, subject: string, html: string, userId?: string) {
    if (isDemoMode() || !hasSendGrid()) {
      console.log('📧 DEMO EMAIL ENVIADO:', {
        to,
        subject,
        html: html.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      });
      
      // Simular log no banco local
      const logs = JSON.parse(localStorage.getItem('demo_email_logs') || '[]');
      logs.push({
        id: Date.now().toString(),
        user_id: userId,
        to_email: to,
        subject,
        status: 'sent',
        sent_at: new Date().toISOString()
      });
      localStorage.setItem('demo_email_logs', JSON.stringify(logs));
      
      return { success: true, message: 'Email enviado (modo demo)' };
    }
    
    // Implementação real do SendGrid seria aqui
    throw new Error('SendGrid não configurado');
  }

  async getEmailLogs(userId: string) {
    if (isDemoMode()) {
      const logs = JSON.parse(localStorage.getItem('demo_email_logs') || '[]');
      return logs.filter((log: any) => log.user_id === userId);
    }
    
    return [];
  }
}

export const emailAdapter = new DemoEmailAdapter();
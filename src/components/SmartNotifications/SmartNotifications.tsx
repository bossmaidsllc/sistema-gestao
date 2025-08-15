import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, TrendingUp, Users, Calendar, MessageCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface SmartNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  action_url?: string;
  action_label?: string;
  data?: any;
  read: boolean;
  dismissed: boolean;
  created_at: string;
}

interface SmartNotificationsProps {
  onClose: () => void;
}

export default function SmartNotifications({ onClose }: SmartNotificationsProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
      generateSmartNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('smart_notifications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('dismissed', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSmartNotifications = async () => {
    try {
      // Verificar leads inativos
      const { data: inactiveLeads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'new')
        .lt('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString());

      if (inactiveLeads && inactiveLeads.length > 0) {
        await supabase
          .from('smart_notifications')
          .upsert({
            user_id: user?.id,
            type: 'inactive_leads',
            title: `${inactiveLeads.length} leads inativos há 14+ dias`,
            message: 'Que tal uma campanha de reativação para reconquistar esses leads?',
            priority: 'high',
            action_label: 'Criar Campanha',
            data: { lead_count: inactiveLeads.length, lead_ids: inactiveLeads.map(l => l.id) }
          }, { onConflict: 'user_id,type' });
      }

      // Verificar horários vagos na agenda
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', tomorrow.toISOString().split('T')[0]);

      if (!appointments || appointments.length < 3) {
        await supabase
          .from('smart_notifications')
          .upsert({
            user_id: user?.id,
            type: 'empty_slot',
            title: 'Horários vagos amanhã',
            message: 'Você tem horários livres. Que tal enviar uma oferta relâmpago?',
            priority: 'medium',
            action_label: 'Oferta Relâmpago',
            data: { date: tomorrow.toISOString().split('T')[0] }
          }, { onConflict: 'user_id,type' });
      }

      // Verificar milestone de limpezas
      const { data: completedAppointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'completed');

      const completedCount = completedAppointments?.length || 0;
      if (completedCount > 0 && completedCount % 10 === 0) {
        await supabase
          .from('smart_notifications')
          .upsert({
            user_id: user?.id,
            type: 'milestone',
            title: `🎉 Parabéns! ${completedCount} limpezas concluídas!`,
            message: 'Você ganhou 1 lead grátis! Continue assim, você é uma BOSS!',
            priority: 'high',
            action_label: 'Ver Conquistas',
            data: { milestone: completedCount }
          }, { onConflict: 'user_id,type' });
      }

      // Sugestões baseadas em performance
      const { data: recentLeads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (recentLeads && recentLeads.length > 5) {
        await supabase
          .from('smart_notifications')
          .upsert({
            user_id: user?.id,
            type: 'suggestion',
            title: 'Semana movimentada! 🔥',
            message: `${recentLeads.length} novos leads esta semana. Considere aumentar seus preços!`,
            priority: 'medium',
            action_label: 'Ajustar Preços',
            data: { weekly_leads: recentLeads.length }
          }, { onConflict: 'user_id,type' });
      }

      await loadNotifications();
    } catch (error) {
      console.error('Error generating smart notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('smart_notifications')
        .update({ read: true })
        .eq('id', id);

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const dismissNotification = async (id: string) => {
    try {
      await supabase
        .from('smart_notifications')
        .update({ dismissed: true })
        .eq('id', id);

      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const handleAction = async (notification: SmartNotification) => {
    // Marcar como lida
    await markAsRead(notification.id);

    // Executar ação baseada no tipo
    switch (notification.type) {
      case 'inactive_leads':
        // Redirecionar para campanhas
        window.location.hash = '#campaigns';
        break;
      case 'empty_slot':
        // Redirecionar para leads
        window.location.hash = '#leads';
        break;
      case 'milestone':
        // Mostrar conquistas
        alert('🎉 Parabéns pela conquista! Continue assim!');
        break;
      case 'suggestion':
        // Redirecionar para configurações de preço
        alert('💡 Dica: Com alta demanda, você pode aumentar seus preços!');
        break;
    }

    onClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'inactive_leads': return AlertTriangle;
      case 'empty_slot': return Calendar;
      case 'milestone': return TrendingUp;
      case 'suggestion': return Zap;
      case 'campaign': return MessageCircle;
      default: return Bell;
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
      return `${minutes}m atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      return `${days}d atrás`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-16">
        <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-16">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Notificações Inteligentes</h3>
              {unreadCount > 0 && (
                <p className="text-sm text-pink-100">{unreadCount} não lidas</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="font-medium mb-1">Tudo em dia! 🎉</p>
              <p className="text-sm">Suas notificações inteligentes aparecerão aqui</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.priority);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${colorClass} ${
                      !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                        notification.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                        notification.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon size={18} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-medium text-sm ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-2 ml-2">
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatTimeAgo(notification.created_at)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(notification.id);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        {notification.action_label && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(notification);
                            }}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            {notification.action_label}
                          </button>
                        )}
                        
                        {!notification.read && (
                          <div className="mt-2">
                            <span className="w-2 h-2 bg-pink-500 rounded-full inline-block"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-2">
              💡 Notificações baseadas em IA para maximizar seus resultados
            </p>
            <button 
              onClick={generateSmartNotifications}
              className="text-pink-600 hover:text-pink-700 text-sm font-medium"
            >
              Atualizar Sugestões
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
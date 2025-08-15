import React, { useState } from 'react';
import { Bell, X, Check, Clock, User, Calendar, DollarSign, MessageCircle, Star } from 'lucide-react';

interface Notification {
  id: string;
  type: 'appointment' | 'payment' | 'lead' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationsProps {
  onClose: () => void;
}

export default function Notifications({ onClose }: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'lead',
      title: 'Novo Lead Recebido',
      message: 'Amanda Rodriguez solicitou orçamento para Deep Clean',
      timestamp: new Date(Date.now() - 300000), // 5 min ago
      read: false
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Limpeza Confirmada',
      message: 'Sarah Johnson confirmou agendamento para amanhã às 9:00 AM',
      timestamp: new Date(Date.now() - 1800000), // 30 min ago
      read: false
    },
    {
      id: '3',
      type: 'payment',
      title: 'Pagamento Recebido',
      message: 'Michael Davis pagou $120 via cartão de crédito',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false
    },
    {
      id: '4',
      type: 'message',
      title: 'Nova Mensagem',
      message: 'Lisa Parker: "Qual horário você tem disponível?"',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true
    },
    {
      id: '5',
      type: 'system',
      title: 'Trial Expirando',
      message: 'Seu trial gratuito expira em 2 dias. Adicione um método de pagamento.',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      read: true
    },
    {
      id: '6',
      type: 'appointment',
      title: 'Limpeza Concluída',
      message: 'Limpeza na casa de Jennifer Wilson foi marcada como concluída',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      read: true
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'payment': return DollarSign;
      case 'lead': return Star;
      case 'message': return MessageCircle;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'text-blue-600 bg-blue-100';
      case 'payment': return 'text-green-600 bg-green-100';
      case 'lead': return 'text-yellow-600 bg-yellow-100';
      case 'message': return 'text-purple-600 bg-purple-100';
      case 'system': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
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

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-16">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Notificações</h3>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">{unreadCount} não lidas</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  Marcar todas
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-pink-50 border-l-4 border-pink-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon size={18} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-medium text-sm ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.message}
                        </p>
                        
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
          <button className="w-full text-center text-sm text-pink-600 hover:text-pink-700 font-medium">
            Ver todas as notificações
          </button>
        </div>
      </div>
    </div>
  );
}
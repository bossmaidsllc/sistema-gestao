import React, { useState, useEffect } from 'react';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, Search, Image, MapPin, CheckCircle2, Mic, Camera, File } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { ChatMessage } from '../../types';

export default function Chat() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'network'>('network');
  const [networkUsers, setNetworkUsers] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadNetworkUsers();
    }
  }, []);

  const loadNetworkUsers = async () => {
    try {
      if (demoMode) {
        // Demo network users
        const demoUsers = [
          {
            id: '2',
            name: 'Ana Costa',
            company: 'Sparkle Clean',
            city: 'Orlando',
            state: 'FL',
            avatar: null
          },
          {
            id: '3',
            name: 'Carla Santos',
            company: 'Perfect Clean',
            city: 'Tampa',
            state: 'FL',
            avatar: null
          }
        ];
        setNetworkUsers(demoUsers);
      } else {
        // Get users in the same network (other cleaning professionals)
        const { data: users } = await supabase
          .from('profiles')
          .select('id, name, company, city, state, avatar')
          .neq('id', user?.id)
          .limit(20);

        setNetworkUsers(users || []);
      }
    } catch (error) {
      console.error('Error loading network users:', error);
    }
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'Amanda Rodriguez',
      message: 'Olá! Vi seu perfil e gostaria de saber mais sobre o serviço de deep clean para minha casa.',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text'
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'Você',
      message: 'Olá Amanda! Ficamos felizes com seu interesse. O serviço de deep clean inclui limpeza completa de todos os ambientes, incluindo áreas que não são limpas regularmente.',
      timestamp: new Date(Date.now() - 3500000),
      type: 'text'
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'Amanda Rodriguez',
      message: 'Perfeito! Qual seria o valor para uma casa de 3 quartos e 2 banheiros?',
      timestamp: new Date(Date.now() - 1800000),
      type: 'text'
    },
    {
      id: '4',
      senderId: 'me',
      senderName: 'Você',
      message: 'Para uma casa desse tamanho, o valor seria de $180. Inclui todos os produtos e equipamentos. Posso agendar uma visita para esta semana?',
      timestamp: new Date(Date.now() - 1700000),
      type: 'text'
    },
    {
      id: '5',
      senderId: '1',
      senderName: 'Amanda Rodriguez',
      message: 'Perfeito! Pode ser na quinta-feira de manhã?',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    }
  ]);

  const chats = [
    {
      id: '3',
      name: 'Maria Silva - CleanPro',
      lastMessage: 'Oi! Como está indo com os leads essa semana?',
      timestamp: new Date(Date.now() - 7200000),
      unread: 2,
      type: 'network',
      avatar: 'MS'
    },
    {
      id: '4',
      name: 'Ana Costa - Sparkle Clean',
      lastMessage: 'Você tem alguma dica para precificar deep cleaning?',
      timestamp: new Date(Date.now() - 10800000),
      unread: 0,
      type: 'network',
      avatar: 'AC'
    }
  ];

  const emojis = ['😊', '👍', '❤️', '😂', '🙏', '👏', '🔥', '💪', '✨', '🏠', '🧽', '✅', '💯', '🎉', '👌', '💖', '🌟', '🙌'];

  const filteredChats = chats;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatChatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 24) {
      return formatTime(date);
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Você',
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const fileMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Você',
      message: 'Foto enviada: antes_depois_limpeza.jpg',
      timestamp: new Date(),
      type: 'image'
    };
    
    setMessages(prev => [...prev, fileMsg]);
  };

  const handleVoiceMessage = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        const voiceMsg: ChatMessage = {
          id: Date.now().toString(),
          senderId: 'me',
          senderName: 'Você',
          message: '🎤 Mensagem de voz (0:15)',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, voiceMsg]);
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleCameraCapture = () => {
    const photoMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Você',
      message: '📷 Foto enviada: resultado_limpeza.jpg',
      timestamp: new Date(),
      type: 'image'
    };
    setMessages(prev => [...prev, photoMsg]);
  };

  return (
    <div className="p-3 md:p-6">
      <div className="bg-white rounded-lg shadow-md h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col md:flex-row">
        {/* Chat List Sidebar */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col max-h-64 md:max-h-none">
          {/* Header */}
          <div className="p-3 md:p-4 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Chat</h2>
            
            {/* Tabs */}
            <div className="bg-gray-100 rounded-lg p-1">
              <div className="bg-white text-pink-600 shadow-sm py-2 px-3 rounded-md text-sm font-medium text-center">
                Network Profissional
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-3 md:p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar conversas..."
                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-pink-500 text-sm"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeChat === chat.id ? 'bg-pink-50 border-pink-200' : ''
                }`}
              >
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {chat.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-800 truncate text-sm md:text-base">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-1">
                        {formatChatTime(chat.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-xs md:text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                    
                    {chat.unread > 0 && (
                      <div className="mt-2">
                        <span className="bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {chat.unread}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-3 md:p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    AR
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base">Amanda Rodriguez</h3>
                    <p className="text-xs md:text-sm text-green-600">● Online</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 md:space-x-2">
                  <button className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Phone size={16} className="md:w-5 md:h-5" />
                  </button>
                  <button className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Video size={16} className="md:w-5 md:h-5" />
                  </button>
                  <button className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MoreVertical size={16} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                {/* Date Separator */}
                <div className="flex items-center justify-center">
                  <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    Hoje
                  </div>
                </div>
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === 'me'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {message.type === 'image' && (
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="flex">
                              <CheckCircle2 size={12} className="text-pink-200" />
                              <CheckCircle2 size={12} className="text-pink-200 -ml-1" />
                            </div>
                          <span className="text-xs">Imagem</span>
                        </div>
                      )}
                      <p className="text-xs md:text-sm">{message.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs ${
                          message.senderId === 'me' ? 'text-pink-200' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                        {message.senderId === 'me' && (
                          <CheckCircle2 size={12} className="text-pink-200" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-3 md:p-4 border-t border-gray-200">
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiClick(emoji)}
                          className="p-2 hover:bg-gray-200 rounded text-lg transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  {/* Attachment Options */}
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={handleFileUpload}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0 transition-colors"
                      title="Anexar arquivo"
                    >
                      <Paperclip size={16} />
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleCameraCapture}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0 transition-colors"
                      title="Tirar foto"
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-pink-500 text-sm pr-12"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="text-gray-600 hover:text-gray-800 p-1 transition-colors"
                      >
                        <Smile size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Send/Voice Button */}
                  {newMessage.trim() ? (
                    <button
                      type="submit"
                      className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex-shrink-0"
                    >
                      <Send size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVoiceMessage}
                      className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                        isRecording 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-pink-500 text-white hover:bg-pink-600'
                      }`}
                    >
                      <Mic size={18} />
                    </button>
                  )}
                </form>
                
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="flex items-center justify-center space-x-2 text-red-600 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Gravando mensagem de voz...</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-base md:text-lg font-medium mb-2">Selecione uma conversa</h3>
                <p className="text-sm">Escolha um chat para começar a conversar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
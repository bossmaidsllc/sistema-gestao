import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, MessageCircle, Star, Phone, Mail, Send, CheckCircle, X } from 'lucide-react';
import { Lead } from '../../types';

export default function Leads() {
  const [activeTab, setActiveTab] = useState<'new' | 'contacted' | 'converted' | 'lost'>('new');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageTemplates] = useState([
    "Hi! I saw your request for cleaning services. I'd love to help you with that. When would be a good time to discuss your needs?",
    "Hello! Thank you for your interest in our cleaning services. We're available this week and would be happy to provide you with a free estimate.",
    "Hi there! I specialize in the type of cleaning you're looking for. I have great reviews and competitive prices. Can we schedule a quick call?"
  ]);

  const leads: Lead[] = [
    {
      id: '1',
      name: 'Amanda Rodriguez',
      phone: '(305) 555-0130',
      email: 'amanda@email.com',
      address: '456 Coral Way, Miami, FL',
      service: 'Deep Clean',
      budget: 200,
      distance: '2.3 miles',
      createdAt: new Date(),
      status: 'new'
    },
    {
      id: '2',
      name: 'Robert Smith',
      phone: '(305) 555-0131',
      email: 'robert@email.com',
      address: '789 Biscayne Blvd, Miami, FL',
      service: 'Regular Cleaning',
      budget: 120,
      distance: '1.8 miles',
      createdAt: new Date(Date.now() - 3600000),
      status: 'new'
    },
    {
      id: '3',
      name: 'Lisa Parker',
      phone: '(305) 555-0132',
      email: 'lisa@email.com',
      address: '321 Ocean Drive, Miami, FL',
      service: 'Move In-Out',
      budget: 300,
      distance: '4.1 miles',
      createdAt: new Date(Date.now() - 7200000),
      status: 'contacted'
    },
    {
      id: '4',
      name: 'Jennifer Wilson',
      phone: '(305) 555-0133',
      email: 'jennifer@email.com',
      address: '654 Beach Road, Miami, FL',
      service: 'Airbnb Cleaning',
      budget: 80,
      distance: '3.2 miles',
      createdAt: new Date(Date.now() - 1800000),
      status: 'new'
    },
    {
      id: '5',
      name: 'Carlos Martinez',
      phone: '(305) 555-0134',
      email: 'carlos@email.com',
      address: '987 Sunset Ave, Miami, FL',
      service: 'Office Cleaning',
      budget: 250,
      distance: '1.5 miles',
      createdAt: new Date(Date.now() - 900000),
      status: 'new'
    }
  ];

  const filteredLeads = leads.filter(lead => lead.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500 text-white';
      case 'contacted': return 'bg-yellow-500 text-white';
      case 'converted': return 'bg-green-500 text-white';
      case 'lost': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'contacted': return 'Contatado';
      case 'converted': return 'Convertido';
      case 'lost': return 'Perdido';
      default: return status;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes}m atrás`;
    } else {
      return `${hours}h atrás`;
    }
  };

  const handleSendMessage = (lead: Lead) => {
    setSelectedLead(lead);
    setShowMessageModal(true);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const submitMessage = () => {
    if (!message.trim() || !selectedLead) return;
    
    console.log('Sending message to:', selectedLead.name, 'Message:', message);
    
    // Update lead status to contacted
    // In a real app, this would update the database
    
    setShowMessageModal(false);
    setMessage('');
    setSelectedLead(null);
    
    // Show success message
    alert('Mensagem enviada com sucesso!');
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    console.log('Updating lead', leadId, 'to status', newStatus);
    // In a real app, this would update the database
  };

  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Leads</h2>
          <p className="text-sm md:text-base text-gray-600">Novos clientes potenciais próximos a você</p>
        </div>
        <div className="bg-pink-100 px-3 md:px-4 py-2 rounded-lg w-full sm:w-auto text-center">
          <span className="text-pink-700 font-medium text-sm md:text-base">
            {filteredLeads.filter(l => l.status === 'new').length} novos leads hoje
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-4 md:mb-6">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'new', label: 'Novos', count: 4 },
            { key: 'contacted', label: 'Contatados', count: 1 },
            { key: 'converted', label: 'Convertidos', count: 0 },
            { key: 'lost', label: 'Perdidos', count: 0 }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-3 md:px-6 py-3 md:py-4 text-center font-medium transition-colors relative text-sm md:text-base ${
                activeTab === tab.key
                  ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
              {tab.count > 0 && (
                <span className={`ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 md:py-1 text-xs rounded-full ${
                  activeTab === tab.key ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-3 md:space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <MessageCircle size={32} className="mx-auto md:w-12 md:h-12" />
            </div>
            <h3 className="text-base md:text-lg font-medium text-gray-600 mb-2">
              Nenhum lead encontrado
            </h3>
            <p className="text-sm md:text-base text-gray-500">
              {activeTab === 'new' ? 'Novos leads aparecerão aqui quando disponíveis.' : 
               `Nenhum lead ${getStatusLabel(activeTab).toLowerCase()} no momento.`}
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start mb-3 md:mb-4 space-y-2 sm:space-y-0">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 flex flex-col sm:flex-row sm:items-center">
                    {lead.name}
                    <span className={`mt-1 sm:mt-0 sm:ml-3 px-2 py-1 text-xs font-medium rounded-full self-start ${getStatusColor(lead.status)}`}>
                      {getStatusLabel(lead.status)}
                    </span>
                  </h3>
                  <div className="flex items-center text-gray-600 mt-1 text-sm">
                    <Clock size={14} className="mr-1" />
                    <span>{formatTimeAgo(lead.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-yellow-500 text-sm">
                  <MapPin size={14} className="mr-1" />
                  <span className="font-medium text-gray-700">{lead.distance}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="space-y-1 md:space-y-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Phone size={14} className="mr-2 text-pink-500 flex-shrink-0" />
                    <span className="truncate">{lead.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <Mail size={14} className="mr-2 text-pink-500 flex-shrink-0" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  
                  <div className="flex items-start text-gray-600 text-sm">
                    <MapPin size={14} className="mr-2 text-pink-500 flex-shrink-0 mt-0.5" />
                    <span>{lead.address}</span>
                  </div>
                </div>

                <div className="space-y-1 md:space-y-2">
                  <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600 mb-1">Serviço solicitado:</p>
                    <p className="font-medium text-gray-800 text-sm md:text-base">{lead.service}</p>
                  </div>
                  
                  <div className="bg-green-50 p-2 md:p-3 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-600 mb-1">Orçamento:</p>
                    <div className="flex items-center">
                      <DollarSign size={16} className="text-green-600 mr-1" />
                      <span className="font-bold text-green-700 text-sm md:text-base">{lead.budget}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                  onClick={() => handleSendMessage(lead)}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 md:px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm md:text-base"
                >
                  <MessageCircle size={16} />
                  <span>Mensagem</span>
                </button>
                
                <button 
                  onClick={() => handleCall(lead.phone)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 md:px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm md:text-base"
                >
                  <Phone size={16} />
                  <span>Ligar</span>
                </button>

                <button 
                  onClick={() => updateLeadStatus(lead.id, 'converted')}
                  className="sm:w-auto px-3 md:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Star size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tips Card */}
      <div className="mt-6 md:mt-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-4 md:p-6 text-white">
        <h3 className="text-base md:text-lg font-bold mb-2">💡 Dica para Converter Mais Leads</h3>
        <p className="mb-3 text-sm md:text-base">
          Responda rapidamente! Leads que recebem resposta em até 5 minutos têm 
          9x mais chances de serem convertidos.
        </p>
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4 text-xs md:text-sm">
          <span>⚡ Resposta rápida</span>
          <span>💰 Proposta competitiva</span>
          <span>⭐ Mostre avaliações</span>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Enviar Mensagem</h3>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Para: {selectedLead.name}</p>
            </div>
            
            <div className="p-4">
              {/* Message Templates */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Templates Rápidos:
                </label>
                <div className="space-y-2">
                  {messageTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(template)}
                      className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs border transition-colors"
                    >
                      {template.substring(0, 60)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sua Mensagem:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  rows={4}
                  placeholder="Digite sua mensagem personalizada..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {message.length}/500 caracteres
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={submitMessage}
                  disabled={!message.trim()}
                  className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:bg-gray-300 text-sm flex items-center justify-center space-x-2"
                >
                  <Send size={16} />
                  <span>Enviar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
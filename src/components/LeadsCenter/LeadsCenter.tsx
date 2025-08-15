import React, { useState, useEffect } from 'react';
import { Users, Tag, Filter, MessageCircle, Phone, Mail, MapPin, Clock, Star, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  service: string;
  budget?: number;
  distance?: string;
  status: string;
  engagement_score: number;
  last_contact?: string;
  source: string;
  created_at: string;
  tags?: LeadTag[];
}

interface LeadTag {
  id: string;
  tag: string;
  auto_generated: boolean;
}

export default function LeadsCenter() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const tagColors = {
    'nao_respondeu': 'bg-red-100 text-red-800',
    'agendou_1x': 'bg-blue-100 text-blue-800',
    'cliente_regular': 'bg-green-100 text-green-800',
    'inativo_14d': 'bg-yellow-100 text-yellow-800',
    'hot_lead': 'bg-orange-100 text-orange-800',
    'cold_lead': 'bg-gray-100 text-gray-800'
  };

  const tagLabels = {
    'nao_respondeu': 'Não Respondeu',
    'agendou_1x': 'Agendou 1x',
    'cliente_regular': 'Cliente Regular',
    'inativo_14d': 'Inativo 14d',
    'hot_lead': 'Lead Quente',
    'cold_lead': 'Lead Frio'
  };

  const campaignSuggestions = {
    'nao_respondeu': {
      title: 'Campanha de Primeira Impressão',
      message: 'Envie uma mensagem amigável se apresentando e oferecendo um desconto especial',
      template: 'Oi {nome}! Sou a [Seu Nome] da [Sua Empresa]. Vi que você tem interesse em limpeza. Que tal 20% OFF na primeira limpeza? 😊'
    },
    'agendou_1x': {
      title: 'Campanha de Fidelização',
      message: 'Ofereça um pacote mensal com desconto para transformar em cliente regular',
      template: 'Oi {nome}! Gostou da nossa limpeza? Que tal um plano mensal com 15% de desconto? Sua casa sempre limpa! ✨'
    },
    'inativo_14d': {
      title: 'Campanha de Reativação',
      message: 'Oferta especial para reconquistar leads que não respondem há tempo',
      template: 'Oi {nome}! Tenho uma oferta especial só pra você: 30% OFF na próxima limpeza. Válido só até sexta! 🔥'
    }
  };

  useEffect(() => {
    if (user) {
      loadLeads();
      generateAutomaticTags();
    }
  }, [user]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      // Carregar tags para cada lead
      const leadsWithTags = await Promise.all(
        (leadsData || []).map(async (lead) => {
          const { data: tags } = await supabase
            .from('lead_tags')
            .select('*')
            .eq('lead_id', lead.id);

          return { ...lead, tags: tags || [] };
        })
      );

      setLeads(leadsWithTags);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAutomaticTags = async () => {
    try {
      // Chamar função do banco para gerar tags automáticas
      const { error } = await supabase.rpc('generate_lead_tags');
      if (error) throw error;
    } catch (error) {
      console.error('Error generating tags:', error);
    }
  };

  const addManualTag = async (leadId: string, tag: string) => {
    try {
      const { error } = await supabase
        .from('lead_tags')
        .insert({
          user_id: user?.id,
          lead_id: leadId,
          tag: tag,
          auto_generated: false
        });

      if (error) throw error;
      await loadLeads();
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status: newStatus,
          last_contact: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;

      // Criar notificação
      await supabase
        .from('smart_notifications')
        .insert({
          user_id: user?.id,
          type: 'lead_update',
          title: 'Lead Atualizado',
          message: `Status do lead alterado para ${newStatus}`,
          priority: 'medium'
        });

      await loadLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const sendBulkCampaign = async (templateType: string) => {
    try {
      // Simular envio de campanha em massa
      const campaign = campaignSuggestions[templateType as keyof typeof campaignSuggestions];
      
      // Criar campanha
      const { data: campaignData, error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user?.id,
          name: `${campaign.title} - ${new Date().toLocaleDateString()}`,
          type: 'bulk',
          target_audience: 'selected_leads',
          status: 'completed',
          sent_count: selectedLeads.length
        })
        .select()
        .single();

      if (error) throw error;

      // Criar notificação de sucesso
      await supabase
        .from('smart_notifications')
        .insert({
          user_id: user?.id,
          type: 'campaign',
          title: 'Campanha Enviada!',
          message: `${selectedLeads.length} mensagens enviadas com sucesso`,
          priority: 'high'
        });

      setSelectedLeads([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error sending bulk campaign:', error);
    }
  };

  const filteredLeads = selectedTag === 'all' 
    ? leads 
    : leads.filter(lead => 
        lead.tags?.some(tag => tag.tag === selectedTag)
      );

  const uniqueTags = Array.from(
    new Set(leads.flatMap(lead => lead.tags?.map(tag => tag.tag) || []))
  );

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    return `${days} dias atrás`;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando central de leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Central de Leads</h2>
          <p className="text-gray-600">Gerencie e converta seus leads com inteligência</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
            {leads.length} leads totais
          </span>
          {selectedLeads.length > 0 && (
            <button
              onClick={() => setShowBulkActions(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <MessageCircle size={16} />
              <span>Campanha ({selectedLeads.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Novos Leads</p>
              <p className="text-2xl font-bold text-blue-600">
                {leads.filter(l => l.status === 'new').length}
              </p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Não Responderam</p>
              <p className="text-2xl font-bold text-red-600">
                {leads.filter(l => l.tags?.some(t => t.tag === 'nao_respondeu')).length}
              </p>
            </div>
            <AlertCircle className="text-red-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Convertidos</p>
              <p className="text-2xl font-bold text-green-600">
                {leads.filter(l => l.status === 'converted').length}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa Conversão</p>
              <p className="text-2xl font-bold text-purple-600">
                {leads.length > 0 ? Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter size={20} className="text-gray-500" />
          <span className="font-medium text-gray-700">Filtrar por tags:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedTag === 'all' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({leads.length})
          </button>
          
          {uniqueTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag 
                  ? 'bg-pink-500 text-white' 
                  : `${tagColors[tag as keyof typeof tagColors]} hover:opacity-80`
              }`}
            >
              {tagLabels[tag as keyof typeof tagLabels] || tag} 
              ({leads.filter(l => l.tags?.some(t => t.tag === tag)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Suggestions */}
      {selectedTag !== 'all' && campaignSuggestions[selectedTag as keyof typeof campaignSuggestions] && (
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-4 mb-6 border-l-4 border-pink-500">
          <div className="flex items-start space-x-3">
            <div className="bg-pink-500 rounded-full p-2">
              <MessageCircle className="text-white" size={16} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-pink-800 mb-1">
                💡 {campaignSuggestions[selectedTag as keyof typeof campaignSuggestions].title}
              </h3>
              <p className="text-pink-700 text-sm mb-2">
                {campaignSuggestions[selectedTag as keyof typeof campaignSuggestions].message}
              </p>
              <div className="bg-white rounded p-2 mb-3">
                <p className="text-sm text-gray-700 italic">
                  "{campaignSuggestions[selectedTag as keyof typeof campaignSuggestions].template}"
                </p>
              </div>
              <button
                onClick={() => {
                  const tagLeads = leads.filter(l => l.tags?.some(t => t.tag === selectedTag));
                  setSelectedLeads(tagLeads.map(l => l.id));
                  setShowBulkActions(true);
                }}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Enviar para {leads.filter(l => l.tags?.some(t => t.tag === selectedTag)).length} leads
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {selectedTag === 'all' ? 'Nenhum lead encontrado' : `Nenhum lead com a tag "${tagLabels[selectedTag as keyof typeof tagLabels] || selectedTag}"`}
            </h3>
            <p className="text-gray-500">
              {selectedTag === 'all' 
                ? 'Novos leads aparecerão aqui automaticamente' 
                : 'Tente selecionar outra tag ou aguarde novos leads'
              }
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLeads([...selectedLeads, lead.id]);
                      } else {
                        setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                      }
                    }}
                    className="mt-1"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{lead.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Phone size={14} className="mr-1" />
                        {lead.phone}
                      </span>
                      {lead.email && (
                        <span className="flex items-center">
                          <Mail size={14} className="mr-1" />
                          {lead.email}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatTimeAgo(lead.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="text-yellow-500 mr-1" size={16} />
                    <span className="text-sm font-medium">{lead.engagement_score}/10</span>
                  </div>
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="new">Novo</option>
                    <option value="contacted">Contatado</option>
                    <option value="converted">Convertido</option>
                    <option value="lost">Perdido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Serviço solicitado:</p>
                  <p className="font-medium">{lead.service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Orçamento:</p>
                  <p className="font-medium text-green-600">${lead.budget}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {lead.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tagColors[tag.tag as keyof typeof tagColors] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tagLabels[tag.tag as keyof typeof tagLabels] || tag.tag}
                    </span>
                  ))}
                  <button
                    onClick={() => addManualTag(lead.id, 'hot_lead')}
                    className="px-2 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-500 hover:border-pink-500 hover:text-pink-500"
                  >
                    + Tag
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button className="text-green-600 hover:bg-green-50 p-2 rounded-lg">
                    <MessageCircle size={16} />
                  </button>
                  <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                    <Phone size={16} />
                  </button>
                  <button className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg">
                    <Mail size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bulk Actions Modal */}
      {showBulkActions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Campanha para {selectedLeads.length} leads
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600">Escolha o tipo de campanha para enviar:</p>
              
              {Object.entries(campaignSuggestions).map(([key, suggestion]) => (
                <button
                  key={key}
                  onClick={() => sendBulkCampaign(key)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-800 mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-gray-600">{suggestion.message}</p>
                </button>
              ))}
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowBulkActions(false);
                    setSelectedLeads([]);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
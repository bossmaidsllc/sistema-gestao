import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, Mail, Smartphone, Plus, Play, Pause, BarChart3, Users, Target, Clock, Zap, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { dbAdapter } from '../../lib/adapters/dbAdapter';
import { emailAdapter } from '../../lib/adapters/emailAdapter';
import { smsAdapter } from '../../lib/adapters/smsAdapter';
import { isDemoMode } from '../../lib/adapters';
import { useAuth } from '../../hooks/useAuth';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  target_audience: string;
  sent_count: number;
  opened_count: number;
  response_count: number;
  scheduled_date: string;
  created_at: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  subject?: string;
  message: string;
  variables: string[];
  usage_count: number;
}

export default function Campaigns() {
  const { user, demoMode } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'reactivation',
    target_audience: 'inactive_leads',
    channels: ['whatsapp'],
    template_id: '',
    scheduled_date: '',
    message: ''
  });

  const [templateForm, setTemplateForm] = useState({
    name: '',
    category: 'whatsapp',
    subject: '',
    message: '',
    variables: ['nome']
  });

  useEffect(() => {
    if (user) {
      loadCampaigns();
      loadTemplates();
    }
  }, [user]);

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      if (demoMode) {
        const db = await dbAdapter.from('message_templates');
        await db.select('*').eq('user_id', user?.id).order('usage_count', { ascending: false }).then(({ data, error }) => {
          if (error) throw error;
          setTemplates(data || []);
        });
      } else {
        const { data, error } = await supabase
          .from('message_templates')
          .select('*')
          .eq('user_id', user?.id)
          .order('usage_count', { ascending: false });

        if (error) throw error;
        setTemplates(data || []);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .insert({
          user_id: user?.id,
          name: campaignForm.name,
          type: campaignForm.type,
          target_audience: campaignForm.target_audience,
          message_template_id: campaignForm.template_id || null,
          scheduled_date: campaignForm.scheduled_date || null
        });

      if (error) throw error;

      // Criar notificação
      await supabase
        .from('smart_notifications')
        .insert({
          user_id: user?.id,
          type: 'campaign',
          title: 'Nova Campanha Criada',
          message: `Campanha "${campaignForm.name}" foi criada com sucesso`,
          priority: 'medium'
        });

      await loadCampaigns();
      setShowNewCampaign(false);
      resetCampaignForm();
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const createTemplate = async () => {
    try {
      const { error } = await supabase
        .from('message_templates')
        .insert({
          user_id: user?.id,
          name: templateForm.name,
          category: templateForm.category,
          subject: templateForm.subject,
          message: templateForm.message,
          variables: templateForm.variables
        });

      if (error) throw error;

      await loadTemplates();
      setShowTemplateModal(false);
      resetTemplateForm();
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const sendRealCampaign = async (templateId: string, channels: string[], leadIds: string[]) => {
    try {
      setLoading(true);
      
      // Get template and leads
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      // Para campanhas reais, usar clientes inativos
      const { data: leads } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user?.id)
        .limit(10);

      if (!leads) return;

      let sentCount = 0;
      const errors = [];

      for (const lead of leads) {
        try {
          // Personalizar mensagem
          let personalizedMessage = template.message
            .replace('{nome}', lead.name)
            .replace('{desconto}', '20%')
            .replace('{horario}', '10:00 AM')
            .replace('{data}', 'amanhã')
            .replace('{servico}', lead.cleaning_type);

          // Enviar por email
          if (channels.includes('email') && lead.email) {
            try {
              if (demoMode) {
                await emailAdapter.sendEmail(
                  lead.email,
                  template.subject || 'Oferta Especial - Boss Maids Pro',
                  `<p>${personalizedMessage.replace(/\n/g, '<br>')}</p>`,
                  user?.id
                );
              } else {
                const { error: emailError } = await supabase.functions.invoke('send-email', {
                  body: {
                    to: lead.email,
                    subject: template.subject || 'Oferta Especial - Boss Maids Pro',
                    html: `<p>${personalizedMessage.replace(/\n/g, '<br>')}</p>`,
                    user_id: user?.id
                  }
                });
                if (emailError) throw emailError;
              }
              sentCount++;
            } catch (emailError: any) {
              errors.push(`Email para ${lead.name}: ${emailError.message}`);
            }
          }

          // Enviar por SMS  
          if (channels.includes('sms') && lead.phone) {
            try {
              if (demoMode) {
                await smsAdapter.sendSMS(lead.phone, personalizedMessage, user?.id);
              } else {
                const { error: smsError } = await supabase.functions.invoke('send-sms', {
                  body: {
                    to: lead.phone,
                    message: personalizedMessage,
                    user_id: user?.id
                  }
                });
                if (smsError) throw smsError;
              }
              sentCount++;
            } catch (smsError: any) {
              errors.push(`SMS para ${lead.name}: ${smsError.message}`);
            }
          }
        } catch (error: any) {
          errors.push(`Erro para ${lead.name}: ${error.message}`);
        }
      }

      // Criar campanha no banco
      if (demoMode) {
        const db = await dbAdapter.from('campaigns');
        await db.insert({
          user_id: user?.id,
          name: `Campanha ${template.name} - ${new Date().toLocaleDateString()}`,
          type: channels.includes('email') && channels.includes('sms') ? 'mixed' : channels[0],
          target_audience: 'inactive_clients',
          status: 'completed',
          sent_count: sentCount
        });
      } else {
        const { error } = await supabase
          .from('campaigns')
          .insert({
            user_id: user?.id,
            name: `Campanha ${template.name} - ${new Date().toLocaleDateString()}`,
            type: channels.includes('email') && channels.includes('sms') ? 'mixed' : channels[0],
            target_audience: 'inactive_clients',
            status: 'completed',
            sent_count: sentCount
          });
        if (error) throw error;
      }

      // Notificação de sucesso
      if (!demoMode) {
        await supabase
          .from('notifications')
          .insert({
            user_id: user?.id,
            type: 'campaign',
            title: 'Campanha Enviada!',
            message: `${sentCount} mensagens enviadas com sucesso${errors.length > 0 ? ` (${errors.length} erros)` : ''}`,
            read: false
          });
      }

      await loadCampaigns();
      
      if (errors.length > 0) {
        console.error('Campaign errors:', errors);
        alert(`Campanha ${demoMode ? '(DEMO) ' : ''}enviada com ${errors.length} erros. Verifique os logs.`);
      } else {
        alert(`Campanha ${demoMode ? '(DEMO) ' : ''}enviada com sucesso para ${sentCount} contatos!`);
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert(`Erro ao enviar campanha${demoMode ? ' (modo demo)' : ''}. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  const sendQuickCampaign = async (templateId: string, channels: string[]) => {
    // Get inactive clients for quick campaign
    const { data: inactiveClients } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user?.id)
      .limit(10);

    if (inactiveClients && inactiveClients.length > 0) {
      await sendRealCampaign(templateId, channels, inactiveClients.map(c => c.id));
    }
  };

  const resetCampaignForm = () => {
    setCampaignForm({
      name: '',
      type: 'reactivation',
      target_audience: 'inactive_leads',
      channels: ['whatsapp'],
      template_id: '',
      scheduled_date: '',
      message: ''
    });
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      category: 'whatsapp',
      subject: '',
      message: '',
      variables: ['nome']
    });
  };

  const quickTemplates = templates.filter(t => t.is_default).slice(0, 3);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando campanhas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Campanhas de Reativação</h2>
          <p className="text-gray-600">Reative leads antigos e multiplique seus agendamentos</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Template</span>
          </button>
          <button
            onClick={() => setShowNewCampaign(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Nova Campanha</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Zap size={32} />
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Rápido</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Oferta Última Hora</h3>
          <p className="text-green-100 mb-4 text-sm">Preencha horários vagos com desconto especial</p>
          <button 
            onClick={() => sendQuickCampaign(quickTemplates[0]?.id, ['whatsapp'])}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Enviar Agora
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target size={32} />
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Automático</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Reativação Semanal</h3>
          <p className="text-purple-100 mb-4 text-sm">Mensagens automáticas para leads inativos</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Configurar
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} />
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Personalizado</span>
          </div>
          <h3 className="text-xl font-bold mb-2">Campanha Customizada</h3>
          <p className="text-blue-100 mb-4 text-sm">Crie mensagens personalizadas para grupos específicos</p>
          <button 
            onClick={() => setShowNewCampaign(true)}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Criar Agora
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-gray-800">{campaigns.length}</div>
          <div className="text-sm text-gray-600">Campanhas Criadas</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-green-600">
            {campaigns.reduce((sum, c) => sum + c.sent_count, 0)}
          </div>
          <div className="text-sm text-gray-600">Mensagens Enviadas</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600">
            {campaigns.reduce((sum, c) => sum + c.opened_count, 0)}
          </div>
          <div className="text-sm text-gray-600">Mensagens Abertas</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md text-center">
          <div className="text-2xl font-bold text-pink-600">
            {campaigns.reduce((sum, c) => sum + c.response_count, 0)}
          </div>
          <div className="text-sm text-gray-600">Respostas Recebidas</div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Suas Campanhas</h3>
        </div>
        
        <div className="p-6">
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Send size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma campanha criada</h3>
              <p className="text-gray-500 mb-4">Comece criando sua primeira campanha de reativação</p>
              <button
                onClick={() => setShowNewCampaign(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Criar Primeira Campanha
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">
                        {campaign.type === 'reactivation' ? 'Reativação' : 
                         campaign.type === 'promotion' ? 'Promoção' : 'Rápida'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status === 'active' ? 'Ativa' :
                       campaign.status === 'completed' ? 'Concluída' :
                       campaign.status === 'paused' ? 'Pausada' : 'Rascunho'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">{campaign.sent_count}</div>
                      <div className="text-xs text-gray-600">Enviadas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{campaign.opened_count}</div>
                      <div className="text-xs text-gray-600">Abertas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{campaign.response_count}</div>
                      <div className="text-xs text-gray-600">Respostas</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Criada em {new Date(campaign.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-blue-500 p-1">
                        <BarChart3 size={16} />
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 p-1">
                        <Edit size={16} />
                      </button>
                      <button className="text-gray-500 hover:text-red-500 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Nova Campanha</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Campanha</label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Ex: Reativação Clientes Dezembro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={campaignForm.type}
                  onChange={(e) => setCampaignForm({...campaignForm, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="reactivation">Reativação</option>
                  <option value="promotion">Promoção</option>
                  <option value="follow_up">Follow-up</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Público-Alvo</label>
                <select
                  value={campaignForm.target_audience}
                  onChange={(e) => setCampaignForm({...campaignForm, target_audience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="inactive_leads">Leads Inativos</option>
                  <option value="one_time_clients">Clientes de Uma Vez</option>
                  <option value="regular_clients">Clientes Regulares</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <select
                  value={campaignForm.template_id}
                  onChange={(e) => setCampaignForm({...campaignForm, template_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Selecione um template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Canais</label>
                <div className="space-y-2">
                  {['whatsapp', 'email', 'sms'].map(channel => (
                    <label key={channel} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={campaignForm.channels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCampaignForm({
                              ...campaignForm,
                              channels: [...campaignForm.channels, channel]
                            });
                          } else {
                            setCampaignForm({
                              ...campaignForm,
                              channels: campaignForm.channels.filter(c => c !== channel)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="flex items-center">
                        {channel === 'whatsapp' && <MessageCircle size={16} className="mr-1 text-green-500" />}
                        {channel === 'email' && <Mail size={16} className="mr-1 text-blue-500" />}
                        {channel === 'sms' && <Smartphone size={16} className="mr-1 text-purple-500" />}
                        {channel === 'whatsapp' ? 'WhatsApp' : 
                         channel === 'email' ? 'E-mail' : 'SMS'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowNewCampaign(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={createCampaign}
                  className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Criar Campanha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Novo Template</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Template</label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Ex: Oferta Especial Fim de Semana"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Canal</label>
                <select
                  value={templateForm.category}
                  onChange={(e) => setTemplateForm({...templateForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">E-mail</option>
                  <option value="sms">SMS</option>
                </select>
              </div>

              {templateForm.category === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                  <input
                    type="text"
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm({...templateForm, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Assunto do e-mail"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                <textarea
                  value={templateForm.message}
                  onChange={(e) => setTemplateForm({...templateForm, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows={4}
                  placeholder="Use {nome}, {desconto}, {horario} para personalizar"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Variáveis disponíveis:</p>
                <div className="flex flex-wrap gap-2">
                  {['nome', 'desconto', 'horario', 'data', 'servico'].map(variable => (
                    <span key={variable} className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs">
                      {`{${variable}}`}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={createTemplate}
                  className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                >
                  Salvar Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
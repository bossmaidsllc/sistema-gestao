import React, { useState, useEffect } from 'react';
import { Plus, Search, Phone, Mail, MapPin, Calendar, DollarSign, Edit, Trash2, AlertCircle } from 'lucide-react';
import { supabase, Client } from '../../lib/supabase';
import { dbAdapter } from '../../lib/adapters/dbAdapter';
import { isDemoMode } from '../../lib/adapters';
import { useAuth } from '../../hooks/useAuth';

export default function Clients() {
  const { user, demoMode } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    cleaning_type: 'Regular',
    frequency: 'Weekly',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      loadClients();
    }
  }, [user]);

  const loadClients = async () => {
    try {
      setLoading(true);
      
      if (demoMode) {
        const db = await dbAdapter.from('clients');
        await db.select('*').eq('user_id', user?.id).order('created_at', { ascending: false }).then(({ data, error }) => {
          if (error) throw error;
          setClients(data || []);
        });
      } else {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setClients(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingClient) {
        // Atualizar cliente existente
        const { error } = await supabase
          .from('clients')
          .update({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            cleaning_type: formData.cleaning_type,
            frequency: formData.frequency,
            notes: formData.notes
          })
          .eq('id', editingClient.id);

        if (error) throw error;

        // Criar notificação
        await supabase
          .from('notifications')
          .insert({
            user_id: user?.id,
            type: 'system',
            title: 'Cliente Atualizado',
            message: `${formData.name} foi atualizado com sucesso`
          });
      } else {
        // Criar novo cliente
        const { error } = await supabase
          .from('clients')
          .insert({
            user_id: user?.id,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            cleaning_type: formData.cleaning_type,
            frequency: formData.frequency,
            notes: formData.notes
          });

        if (error) throw error;

        // Criar notificação
        await supabase
          .from('notifications')
          .insert({
            user_id: user?.id,
            type: 'system',
            title: 'Novo Cliente',
            message: `${formData.name} foi adicionado à sua lista de clientes`
          });
      }

      await loadClients();
      setShowModal(false);
      setEditingClient(null);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email || '',
      address: client.address,
      cleaning_type: client.cleaning_type,
      frequency: client.frequency,
      notes: client.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (client: Client) => {
    if (!confirm(`Tem certeza que deseja excluir ${client.name}?`)) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', client.id);

      if (error) throw error;

      // Criar notificação
      await supabase
        .from('notifications')
        .insert({
          user_id: user?.id,
          type: 'system',
          title: 'Cliente Removido',
          message: `${client.name} foi removido da sua lista de clientes`
        });

      await loadClients();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      cleaning_type: 'Regular',
      frequency: 'Weekly',
      notes: ''
    });
  };

  const openNewClientModal = () => {
    setEditingClient(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Clientes</h2>
          <p className="text-sm md:text-base text-gray-600">
            {clients.length} cliente{clients.length !== 1 ? 's' : ''} cadastrado{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openNewClientModal}
          className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center justify-center space-x-2 shadow-md transition-colors text-sm md:text-base"
        >
          <Plus size={18} />
          <span>Novo Cliente</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="text-red-500" size={16} />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-3 md:p-4 mb-4 md:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar clientes por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm md:text-base"
          />
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
          <div className="text-gray-400 mb-4">
            <MapPin size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg md:text-xl font-medium text-gray-600 mb-2">
            {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </h3>
          <p className="text-sm md:text-base text-gray-500 mb-4">
            {searchTerm 
              ? 'Tente buscar com outros termos.' 
              : 'Comece adicionando seu primeiro cliente.'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={openNewClientModal}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Adicionar Primeiro Cliente
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow border-l-4 border-pink-500"
            >
              <div className="flex justify-between items-start mb-3 md:mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">{client.name}</h3>
                <div className="flex space-x-1 md:space-x-2">
                  <button 
                    onClick={() => handleEdit(client)}
                    className="text-gray-500 hover:text-pink-500 transition-colors p-1"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(client)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center text-gray-600">
                  <Phone size={14} className="mr-2 text-pink-500 flex-shrink-0" />
                  <span className="text-sm truncate">{client.phone}</span>
                </div>
                
                {client.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail size={14} className="mr-2 text-pink-500 flex-shrink-0" />
                    <span className="text-sm truncate">{client.email}</span>
                  </div>
                )}
                
                <div className="flex items-start text-gray-600">
                  <MapPin size={14} className="mr-2 text-pink-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{client.address}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Calendar size={14} className="mr-2 text-pink-500 flex-shrink-0" />
                  <span className="text-sm">{client.frequency}</span>
                </div>
              </div>

              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                    client.cleaning_type === 'Deep Clean' ? 'bg-purple-100 text-purple-800' :
                    client.cleaning_type === 'Regular' ? 'bg-blue-100 text-blue-800' :
                    client.cleaning_type === 'Move In-Out' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {client.cleaning_type}
                  </span>
                  
                  <div className="text-right">
                    <div className="flex items-center text-green-600">
                      <DollarSign size={14} className="mr-1" />
                      <span className="font-bold text-sm md:text-base">{client.total_paid}</span>
                    </div>
                    <span className="text-xs text-gray-500">Total pago</span>
                  </div>
                </div>

                <button className="w-full bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-700 py-2 rounded-lg transition-colors text-sm">
                  Ver Histórico
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 rounded-t-lg">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
            </div>
            
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Limpeza
                  </label>
                  <select
                    value={formData.cleaning_type}
                    onChange={(e) => setFormData({ ...formData, cleaning_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Deep Clean">Deep Clean</option>
                    <option value="Move In-Out">Move In-Out</option>
                    <option value="Airbnb">Airbnb</option>
                    <option value="Post Construction">Post Construction</option>
                    <option value="Office">Office</option>
                    <option value="Carpet">Carpet</option>
                    <option value="Window">Window</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequência
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  >
                    <option value="Weekly">Semanal</option>
                    <option value="Bi-weekly">Quinzenal</option>
                    <option value="Monthly">Mensal</option>
                    <option value="One-time">Uma vez</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    rows={3}
                    placeholder="Instruções especiais, preferências, etc."
                  ></textarea>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingClient(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm"
                  >
                    {editingClient ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
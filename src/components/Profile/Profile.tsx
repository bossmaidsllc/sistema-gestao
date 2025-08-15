import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Building, Calendar, DollarSign, Edit, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ProfileProps {
  onClose: () => void;
}

export default function Profile({ onClose }: ProfileProps) {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    company: profile?.company || '',
    city: profile?.city || '',
    state: profile?.state || ''
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Clientes Ativos', value: '47', icon: User, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Receita Mensal', value: '$8,420', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Limpezas Realizadas', value: '234', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Plano Atual', value: profile?.plan === 'premium' ? 'Premium' : profile?.plan === 'basic' ? 'Básico' : 'Trial', icon: Building, color: 'text-pink-600', bg: 'bg-pink-100' }
  ];

  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 bg-pink-600 p-2 rounded-full hover:bg-pink-700">
                <Camera size={14} />
              </button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-pink-100">{profile.company || 'Boss Cleaning Co.'}</p>
              <p className="text-pink-200 text-sm">{profile.city}, {profile.state}</p>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
            >
              <Edit size={18} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Estatísticas</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className={stat.color} size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Informações Pessoais</h3>
            {isEditing && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{loading ? 'Salvando...' : 'Salvar'}</span>
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <div className="flex items-center space-x-2 p-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-800">{profile.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <div className="flex items-center space-x-2 p-2">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-800">{profile.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <div className="flex items-center space-x-2 p-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-800">{profile.phone || 'Não informado'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <div className="flex items-center space-x-2 p-2">
                  <Building size={16} className="text-gray-400" />
                  <span className="text-gray-800">{profile.company || 'Não informado'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <div className="flex items-center space-x-2 p-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-800">{profile.city || 'Não informado'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              {isEditing ? (
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Selecione</option>
                  <option value="FL">Florida</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="NY">New York</option>
                  <option value="NJ">New Jersey</option>
                </select>
              ) : (
                <div className="flex items-center space-x-2 p-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-800">{profile.state || 'Não informado'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plan Info */}
        <div className="p-6 bg-gray-50 border-t">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Plano Atual</h3>
          <div className="bg-white rounded-lg p-4 border-l-4 border-pink-500">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-800">
                  {profile.plan === 'premium' ? 'Boss Maids Pro Premium' : 
                   profile.plan === 'basic' ? 'Boss Maids Pro Básico' : 'Trial Gratuito'}
                </h4>
                <p className="text-sm text-gray-600">
                  {profile.plan === 'trial' ? `${profile.trial_days_left} dias restantes` : 'Plano Ativo'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-pink-600">
                  {profile.plan === 'premium' ? '$47' : profile.plan === 'basic' ? '$19.90' : 'Grátis'}
                </p>
                <p className="text-sm text-gray-500">/mês</p>
              </div>
            </div>
            
            {profile.plan === 'trial' && (
              <div className="mt-4">
                <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Fazer Upgrade
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
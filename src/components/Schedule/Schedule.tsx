import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, Phone, Mail, X, User, Search } from 'lucide-react';
import { Client } from '../../types';

interface CleaningType {
  id: string;
  name: string;
  basePrice: number;
  description: string;
}

interface PriceCalculation {
  basePrice: number;
  sizeMultiplier: number;
  frequencyDiscount: number;
  total: number;
}

export default function Schedule() {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchClient, setSearchClient] = useState('');

  const cleaningTypes: CleaningType[] = [
    { id: 'regular', name: 'Regular Cleaning', basePrice: 80, description: 'Limpeza de manutenção semanal/quinzenal' },
    { id: 'deep', name: 'Deep Cleaning', basePrice: 150, description: 'Limpeza completa e detalhada' },
    { id: 'movein', name: 'Move In/Out Cleaning', basePrice: 200, description: 'Limpeza para mudança' },
    { id: 'airbnb', name: 'Airbnb Turnover', basePrice: 60, description: 'Limpeza entre hóspedes' },
    { id: 'postcon', name: 'Post Construction', basePrice: 300, description: 'Limpeza pós-construção' },
    { id: 'office', name: 'Office Cleaning', basePrice: 120, description: 'Limpeza comercial' },
    { id: 'carpet', name: 'Carpet Cleaning', basePrice: 100, description: 'Limpeza de carpetes' },
    { id: 'window', name: 'Window Cleaning', basePrice: 80, description: 'Limpeza de janelas' }
  ];

  const existingClients: Client[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '(305) 555-0123',
      email: 'sarah@email.com',
      address: '123 Oak Street, Miami, FL',
      cleaningType: 'Deep Clean',
      frequency: 'Weekly',
      totalPaid: 1200,
      createdAt: new Date('2024-01-10')
    },
    {
      id: '2',
      name: 'Michael Davis',
      phone: '(305) 555-0124',
      email: 'michael@email.com',
      address: '456 Pine Avenue, Miami, FL',
      cleaningType: 'Regular',
      frequency: 'Bi-weekly',
      totalPaid: 800,
      createdAt: new Date('2024-01-08')
    }
  ];

  const appointments = [
    {
      id: 1,
      clientName: 'Sarah Johnson',
      phone: '(305) 555-0123',
      email: 'sarah@email.com',
      address: '123 Oak Street, Miami, FL',
      date: '2024-01-15',
      time: '9:00 AM',
      category: 'Deep Clean',
      value: 150,
      notes: 'Cliente prefere produtos orgânicos',
      status: 'scheduled'
    },
    {
      id: 2,
      clientName: 'Michael Davis',
      phone: '(305) 555-0124',
      email: 'michael@email.com',
      address: '456 Pine Avenue, Miami, FL',
      date: '2024-01-15',
      time: '1:00 PM',
      category: 'Regular',
      value: 80,
      notes: 'Chave escondida no vaso de plantas',
      status: 'confirmed'
    }
  ];

  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    address: '',
    date: '',
    time: '',
    category: 'regular',
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1000,
    frequency: 'one-time',
    value: 0,
    notes: ''
  });

  const calculatePrice = (): PriceCalculation => {
    const cleaningType = cleaningTypes.find(t => t.id === formData.category);
    if (!cleaningType) return { basePrice: 0, sizeMultiplier: 1, frequencyDiscount: 0, total: 0 };

    const basePrice = cleaningType.basePrice;
    
    // Size multiplier based on bedrooms and bathrooms
    const sizeScore = (formData.bedrooms * 0.3) + (formData.bathrooms * 0.2) + (formData.squareFeet / 1000 * 0.5);
    const sizeMultiplier = Math.max(0.8, Math.min(2.0, sizeScore));
    
    // Frequency discount
    const frequencyDiscounts = {
      'weekly': 0.15,
      'bi-weekly': 0.10,
      'monthly': 0.05,
      'one-time': 0
    };
    
    const frequencyDiscount = frequencyDiscounts[formData.frequency as keyof typeof frequencyDiscounts] || 0;
    
    const subtotal = basePrice * sizeMultiplier;
    const discount = subtotal * frequencyDiscount;
    const total = Math.round(subtotal - discount);
    
    return {
      basePrice,
      sizeMultiplier,
      frequencyDiscount,
      total
    };
  };

  const priceCalculation = calculatePrice();

  React.useEffect(() => {
    setFormData(prev => ({ ...prev, value: priceCalculation.total }));
  }, [priceCalculation.total]);

  const handleDateClick = (day: number) => {
    if (day > 0 && day <= 31) {
      const dateStr = `2024-01-${day.toString().padStart(2, '0')}`;
      setSelectedDate(dateStr);
      setFormData(prev => ({ ...prev, date: dateStr }));
      setShowModal(true);
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setFormData(prev => ({
      ...prev,
      clientName: client.name,
      phone: client.phone,
      email: client.email,
      address: client.address
    }));
    setShowClientSelector(false);
  };

  const filteredClients = existingClients.filter(client =>
    client.name.toLowerCase().includes(searchClient.toLowerCase()) ||
    client.phone.includes(searchClient)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New appointment:', formData);
    setShowModal(false);
    setSelectedClient(null);
    setFormData({
      clientName: '',
      phone: '',
      email: '',
      address: '',
      date: '',
      time: '',
      category: 'regular',
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 1000,
      frequency: 'one-time',
      value: 0,
      notes: ''
    });
  };

  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Agenda</h2>
          <p className="text-sm md:text-base text-gray-600">Gerencie seus agendamentos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center justify-center space-x-2 shadow-md transition-colors text-sm md:text-base"
        >
          <Plus size={18} />
          <span>Novo Agendamento</span>
        </button>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-md p-3 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center">
            <Calendar className="mr-2 text-pink-500" size={18} />
            Janeiro 2024
          </h3>
          <div className="flex space-x-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
              Semana
            </button>
            <button className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-pink-500 text-white rounded-lg text-sm">
              Mês
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="p-2 md:p-3 text-center font-medium text-gray-600 bg-gray-50 rounded text-xs md:text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 6;
            const isToday = day === 15;
            const hasAppointment = day === 15 || day === 16;
            
            return (
              <div
                key={i}
                onClick={() => handleDateClick(day)}
                className={`p-2 md:p-3 min-h-[50px] md:min-h-[80px] border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors ${
                  isToday ? 'bg-pink-100 border-pink-300' : ''
                }`}
              >
                <span className={`text-xs md:text-sm ${isToday ? 'font-bold text-pink-600' : 'text-gray-600'}`}>
                  {day > 0 && day <= 31 ? day : ''}
                </span>
                {hasAppointment && day > 0 && (
                  <div className="mt-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-pink-500 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-3 md:p-6 border-b border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-800">Agendamentos de Hoje</h3>
        </div>
        
        <div className="p-3 md:p-6">
          <div className="space-y-3 md:space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row justify-between">
                  <div className="flex-1 mb-3 lg:mb-0">
                    <h4 className="font-semibold text-gray-800 text-base md:text-lg">{appointment.clientName}</h4>
                    
                    <div className="mt-2 space-y-1 md:space-y-2">
                      <p className="text-gray-600 flex items-center text-sm md:text-base">
                        <Phone size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate">{appointment.phone}</span>
                      </p>
                      <p className="text-gray-600 flex items-center text-sm md:text-base">
                        <Mail size={14} className="mr-2 flex-shrink-0" />
                        <span className="truncate">{appointment.email}</span>
                      </p>
                      <p className="text-gray-600 flex items-start text-sm md:text-base">
                        <MapPin size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>{appointment.address}</span>
                      </p>
                      <p className="text-gray-600 flex items-center text-sm md:text-base">
                        <Clock size={14} className="mr-2 flex-shrink-0" />
                        {appointment.time}
                      </p>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 p-2 md:p-3 bg-gray-50 rounded">
                        <p className="text-xs md:text-sm text-gray-600">
                          <strong>Observações:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex lg:flex-col justify-between lg:justify-start items-end lg:items-end lg:ml-4 lg:text-right">
                    <div className="lg:mb-2">
                      <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                        appointment.category === 'Deep Clean' ? 'bg-purple-100 text-purple-800' :
                        appointment.category === 'Regular' ? 'bg-blue-100 text-blue-800' :
                        appointment.category === 'Move In-Out' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {appointment.category}
                      </span>
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-gray-800">${appointment.value}</p>
                      <p className={`text-xs md:text-sm mt-1 ${
                        appointment.status === 'confirmed' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {appointment.status === 'confirmed' ? 'Confirmado' : 'Agendado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for New Appointment */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Novo Agendamento</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Client Selection */}
              <div className="mb-4">
                <div className="flex space-x-2 mb-3">
                  <button
                    onClick={() => setShowClientSelector(true)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                  >
                    Cliente Existente
                  </button>
                  <button
                    onClick={() => {
                      setSelectedClient(null);
                      setFormData(prev => ({
                        ...prev,
                        clientName: '',
                        phone: '',
                        email: '',
                        address: ''
                      }));
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                  >
                    Novo Cliente
                  </button>
                </div>
                
                {selectedClient && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <p className="font-medium text-blue-800">{selectedClient.name}</p>
                    <p className="text-sm text-blue-600">{selectedClient.phone}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!selectedClient && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Cliente
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone
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
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Endereço
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Digite o endereço completo"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Limpeza
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  >
                    {cleaningTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} - ${type.basePrice}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {cleaningTypes.find(t => t.id === formData.category)?.description}
                  </p>
                </div>

                {/* House Details for Price Calculation */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3 text-sm">Detalhes da Casa</h4>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Quartos
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 1 })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Banheiros
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 1 })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Sq Ft
                      </label>
                      <input
                        type="number"
                        min="500"
                        max="10000"
                        step="100"
                        value={formData.squareFeet}
                        onChange={(e) => setFormData({ ...formData, squareFeet: parseInt(e.target.value) || 1000 })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Frequência
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="weekly">Semanal (-15%)</option>
                      <option value="bi-weekly">Quinzenal (-10%)</option>
                      <option value="monthly">Mensal (-5%)</option>
                      <option value="one-time">Uma vez</option>
                    </select>
                  </div>
                </div>

                {/* Price Calculation Display */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2 text-sm">Cálculo do Preço</h4>
                  <div className="space-y-1 text-xs text-green-700">
                    <div className="flex justify-between">
                      <span>Preço base:</span>
                      <span>${priceCalculation.basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Multiplicador tamanho:</span>
                      <span>{priceCalculation.sizeMultiplier.toFixed(1)}x</span>
                    </div>
                    {priceCalculation.frequencyDiscount > 0 && (
                      <div className="flex justify-between">
                        <span>Desconto frequência:</span>
                        <span>-{(priceCalculation.frequencyDiscount * 100).toFixed(0)}%</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-green-800 border-t pt-1">
                      <span>Total:</span>
                      <span>${priceCalculation.total}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                    rows={2}
                    placeholder="Instruções especiais, chaves, etc."
                  ></textarea>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-sm"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Client Selector Modal */}
      {showClientSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-800">Selecionar Cliente</h3>
                <button
                  onClick={() => setShowClientSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-96">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleClientSelect(client)}
                  className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                      <User className="text-white" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{client.name}</p>
                      <p className="text-sm text-gray-600 truncate">{client.phone}</p>
                      <p className="text-xs text-gray-500 truncate">{client.address}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
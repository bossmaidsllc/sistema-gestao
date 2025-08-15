import React from 'react';
import { Calendar, DollarSign, Users, TrendingUp, Clock, MapPin } from 'lucide-react';

export default function Dashboard() {
  const todayStats = [
    {
      title: 'Limpezas Hoje',
      value: '3',
      icon: Calendar,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Receita do Dia',
      value: '$380',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Novos Leads',
      value: '5',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Taxa de Conversão',
      value: '68%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const todayAppointments = [
    {
      id: 1,
      client: 'Sarah Johnson',
      time: '9:00 AM',
      address: '123 Oak Street, Miami, FL',
      service: 'Deep Clean',
      value: 150,
      status: 'confirmed'
    },
    {
      id: 2,
      client: 'Michael Davis',
      time: '1:00 PM',
      address: '456 Pine Avenue, Miami, FL',
      service: 'Regular',
      value: 80,
      status: 'in-progress'
    },
    {
      id: 3,
      client: 'Jessica Brown',
      time: '4:00 PM',
      address: '789 Elm Drive, Miami, FL',
      service: 'Move In-Out',
      value: 200,
      status: 'scheduled'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-pink-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Calendar className="mr-2 text-pink-500" size={24} />
            Agenda de Hoje
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full">
                    <Clock className="text-pink-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{appointment.client}</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {appointment.address}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.service}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-800">${appointment.value}</p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {appointment.status === 'confirmed' ? 'Confirmado' : 
                     appointment.status === 'in-progress' ? 'Em Andamento' : 'Agendado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Novo Agendamento</h3>
          <p className="mb-4">Adicione rapidamente um novo cliente</p>
          <button className="bg-white text-pink-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Agendar Agora
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Ver Leads</h3>
          <p className="mb-4">5 novos leads aguardando resposta</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Ver Leads
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Relatórios</h3>
          <p className="mb-4">Analise o desempenho da semana</p>
          <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Ver Relatório
          </button>
        </div>
      </div>
    </div>
  );
}
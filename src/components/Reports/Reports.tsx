import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, DollarSign, Users, TrendingUp, Download, Filter, Mail, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { dbAdapter } from '../../lib/adapters/dbAdapter';
import { emailAdapter } from '../../lib/adapters/emailAdapter';
import { smsAdapter } from '../../lib/adapters/smsAdapter';
import { isDemoMode } from '../../lib/adapters';
import { useAuth } from '../../hooks/useAuth';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

export default function Reports() {
  const { user, demoMode } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [reportData, setReportData] = useState({
    revenue: [],
    appointments: [],
    clients: [],
    campaigns: [],
    summary: {
      totalRevenue: 0,
      totalAppointments: 0,
      totalClients: 0,
      conversionRate: 0
    }
  });

  useEffect(() => {
    if (user) {
      loadReportData();
    }
  }, [user, dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = subDays(endDate, parseInt(dateRange));

      let appointments: any[] = [];
      let clients: any[] = [];
      let leads: any[] = [];
      let emailLogs: any[] = [];
      let smsLogs: any[] = [];

      if (demoMode) {
        // Carregar dados demo
        const appointmentsDb = await dbAdapter.from('appointments');
        await appointmentsDb.select('*').eq('user_id', user?.id).then(({ data }) => {
          appointments = (data || []).filter((apt: any) => 
            apt.date >= startDate.toISOString().split('T')[0] &&
            apt.date <= endDate.toISOString().split('T')[0]
          );
        });

        const clientsDb = await dbAdapter.from('clients');
        await clientsDb.select('*').eq('user_id', user?.id).then(({ data }) => {
          clients = (data || []).filter((client: any) => 
            new Date(client.created_at) >= startDate
          );
        });

        const leadsDb = await dbAdapter.from('leads');
        await leadsDb.select('*').eq('user_id', user?.id).then(({ data }) => {
          leads = (data || []).filter((lead: any) => 
            new Date(lead.created_at) >= startDate
          );
        });

        emailLogs = await emailAdapter.getEmailLogs(user?.id || '');
        smsLogs = await smsAdapter.getSmsLogs(user?.id || '');
      } else {
        // Carregar dados reais do Supabase
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select('*, clients(name)')
          .eq('user_id', user?.id)
          .gte('date', startDate.toISOString().split('T')[0])
          .lte('date', endDate.toISOString().split('T')[0]);

        const { data: clientsData } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user?.id)
          .gte('created_at', startDate.toISOString());

        const { data: leadsData } = await supabase
          .from('leads')
          .select('*')
          .eq('user_id', user?.id)
          .gte('created_at', startDate.toISOString());

        const { data: emailLogsData } = await supabase
          .from('email_logs')
          .select('*')
          .eq('user_id', user?.id)
          .gte('sent_at', startDate.toISOString());

        const { data: smsLogsData } = await supabase
          .from('sms_logs')
          .select('*')
          .eq('user_id', user?.id)
          .gte('sent_at', startDate.toISOString());

        appointments = appointmentsData || [];
        clients = clientsData || [];
        leads = leadsData || [];
        emailLogs = emailLogsData || [];
        smsLogs = smsLogsData || [];
      }

      // Processar dados para gráficos
      const revenueByDay = processRevenueData(appointments);
      const appointmentsByDay = processAppointmentData(appointments);
      const clientsByType = processClientData(clients);
      const campaignStats = processCampaignData(emailLogs, smsLogs);

      // Calcular resumo
      const totalRevenue = appointments.reduce((sum, apt) => sum + (apt.value || 0), 0);
      const totalAppointments = appointments.length;
      const totalClients = clients.length;
      const conversionRate = leads.length > 0 ? (totalClients / leads.length) * 100 : 0;

      setReportData({
        revenue: revenueByDay,
        appointments: appointmentsByDay,
        clients: clientsByType,
        campaigns: campaignStats,
        summary: {
          totalRevenue,
          totalAppointments,
          totalClients,
          conversionRate
        }
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processRevenueData = (appointments: any[]) => {
    const revenueMap = new Map();
    
    appointments.forEach(apt => {
      const date = format(new Date(apt.date), 'MM/dd');
      const current = revenueMap.get(date) || 0;
      revenueMap.set(date, current + (apt.value || 0));
    });

    return Array.from(revenueMap.entries()).map(([date, revenue]) => ({
      date,
      revenue
    }));
  };

  const processAppointmentData = (appointments: any[]) => {
    const appointmentMap = new Map();
    
    appointments.forEach(apt => {
      const date = format(new Date(apt.date), 'MM/dd');
      const current = appointmentMap.get(date) || 0;
      appointmentMap.set(date, current + 1);
    });

    return Array.from(appointmentMap.entries()).map(([date, count]) => ({
      date,
      count
    }));
  };

  const processClientData = (clients: any[]) => {
    const typeMap = new Map();
    
    clients.forEach(client => {
      const type = client.cleaning_type || 'Regular';
      const current = typeMap.get(type) || 0;
      typeMap.set(type, current + 1);
    });

    const colors = ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
    
    return Array.from(typeMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };

  const processCampaignData = (emailLogs: any[], smsLogs: any[]) => {
    return [
      { name: 'Emails Enviados', value: emailLogs.length, color: '#ec4899' },
      { name: 'SMS Enviados', value: smsLogs.length, color: '#8b5cf6' }
    ];
  };

  const exportReport = () => {
    const csvContent = [
      ['Data', 'Receita', 'Agendamentos'],
      ...reportData.revenue.map(item => [
        item.date,
        item.revenue,
        reportData.appointments.find(apt => apt.date === item.date)?.count || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Relatórios</h2>
          <p className="text-gray-600">Análise completa do seu negócio</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
          <button
            onClick={exportReport}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm"
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">
                ${reportData.summary.totalRevenue.toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Agendamentos</p>
              <p className="text-2xl font-bold text-blue-600">
                {reportData.summary.totalAppointments}
              </p>
            </div>
            <Calendar className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Novos Clientes</p>
              <p className="text-2xl font-bold text-purple-600">
                {reportData.summary.totalClients}
              </p>
            </div>
            <Users className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxa Conversão</p>
              <p className="text-2xl font-bold text-pink-600">
                {reportData.summary.conversionRate.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="text-pink-500" size={24} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Receita por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Receita']} />
              <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Agendamentos por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.appointments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Types */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Tipos de Limpeza</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.clients}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {reportData.clients.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Campaign Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Campanhas Enviadas</h3>
          <div className="space-y-4">
            {reportData.campaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {campaign.name.includes('Email') ? (
                    <Mail className="text-pink-500" size={20} />
                  ) : (
                    <MessageSquare className="text-purple-500" size={20} />
                  )}
                  <span className="font-medium text-gray-800">{campaign.name}</span>
                </div>
                <span className="text-2xl font-bold" style={{ color: campaign.color }}>
                  {campaign.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
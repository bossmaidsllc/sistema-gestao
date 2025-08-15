import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import Notifications from '../Notifications/Notifications';
import Profile from '../Profile/Profile';

interface HeaderProps {
  currentPage: string;
}

const pageNames: Record<string, string> = {
  dashboard: 'Dashboard',
  schedule: 'Agenda',
  clients: 'Clientes',
  leads: 'Leads',
  campaigns: 'Campanhas',
  chat: 'Chat',
  courses: 'Cursos',
  'ai-assistant': 'Suporte IA',
  billing: 'Meu Plano',
  reports: 'Relatórios',
  settings: 'Configurações'
};

export default function Header({ currentPage }: HeaderProps) {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <img 
                src="/Orange and Dark Gray Retro Apparel Logo.png" 
                alt="Boss Maids Pro" 
                className="w-6 h-6 md:w-8 md:h-8 sm:hidden"
              />
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">
                {pageNames[currentPage] || 'Boss Maids Pro'}
              </h2>
            </div>
            <p className="text-gray-600 text-xs md:text-sm mt-1 hidden sm:block ml-8 md:ml-0">
              Gerencie sua empresa de limpeza de forma profissional
            </p>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} className="md:w-5 md:h-5" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm w-32 md:w-auto"
              />
            </div>

            {/* Notifications */}
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg relative transition-colors"
            >
              <Bell size={18} className="md:w-5 md:h-5" />
              <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile */}
            <button 
              onClick={() => setShowProfile(true)}
              className="flex items-center space-x-1 md:space-x-2 p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 md:w-8 md:h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <User className="text-white" size={14} className="md:w-4 md:h-4" />
              </div>
            </button>
          </div>
        </div>
      </header>
      
      {/* Modals */}
      {showNotifications && (
        <Notifications onClose={() => setShowNotifications(false)} />
      )}
      
      {showProfile && (
        <Profile onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}
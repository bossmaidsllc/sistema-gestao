import React from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  Target, 
  MessageCircle, 
  GraduationCap, 
  Bot,
  CreditCard,
  Settings,
  LogOut,
  Send,
  Tag,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'schedule', label: 'Agenda', icon: Calendar },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'leads', label: 'Leads', icon: Target },
  { id: 'campaigns', label: 'Campanhas', icon: Send },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'courses', label: 'Cursos', icon: GraduationCap },
  { id: 'ai-assistant', label: 'Suporte IA', icon: Bot },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
];

const bottomItems = [
  { id: 'billing', label: 'Meu Plano', icon: CreditCard },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="w-16 md:w-64 bg-black text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-3 md:p-6 border-b border-gray-800">
        <div className="flex items-center justify-center md:justify-start">
          <img 
            src="/Orange and Dark Gray Retro Apparel Logo.png" 
            alt="Boss Maids Pro Logo" 
            className="w-8 h-8 md:w-10 md:h-10 mr-0 md:mr-3"
          />
          <div className="hidden md:block">
            <h1 className="text-lg md:text-2xl font-bold text-pink-400">Boss Maids Pro</h1>
          </div>
        </div>
        <p className="text-xs md:text-sm text-gray-400 mt-1 hidden md:block">Professional Cleaning SaaS</p>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 py-3 md:py-6">
        <div className="space-y-1 md:space-y-2 px-2 md:px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center justify-center md:justify-start space-x-0 md:space-x-3 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
                  currentPage === item.id 
                    ? 'bg-pink-500 text-white shadow-lg md:transform md:scale-105' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={18} className="md:w-5 md:h-5" />
                <span className="font-medium text-sm hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-gray-800 p-2 md:p-4 space-y-1 md:space-y-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center justify-center md:justify-start space-x-0 md:space-x-3 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all ${
                currentPage === item.id 
                  ? 'bg-pink-500 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={16} className="md:w-4 md:h-4" />
              <span className="text-xs font-medium hidden md:inline">{item.label}</span>
            </button>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center md:justify-start space-x-0 md:space-x-3 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-all text-gray-400 hover:bg-red-800 hover:text-white"
        >
          <LogOut size={16} className="md:w-4 md:h-4" />
          <span className="text-xs font-medium hidden md:inline">Sair</span>
        </button>
      </div>
    </div>
  );
}
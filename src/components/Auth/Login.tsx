import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Building, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoginProps {
  onBack?: () => void;
  onSignupRedirect?: () => void;
}

export default function Login({ onBack, onSignupRedirect }: LoginProps) {
  const { signIn, loading, demoMode } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signIn(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 flex items-center justify-center p-4">
      {demoMode && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 z-50">
          <p className="text-yellow-800 text-sm font-medium">
            🎭 Modo Demo Ativo - Login simulado
          </p>
        </div>
      )}
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-6 text-center">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-4 left-4 group flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl transition-all transform hover:scale-105 shadow-lg border border-pink-400/30 backdrop-blur-sm"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:-translate-x-0.5">
                <svg className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-bold text-sm">Voltar</span>
            </button>
          )}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 p-2 shadow-lg">
            <img 
              src="/Orange and Dark Gray Retro Apparel Logo.png" 
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            Entrar na Sua Conta
          </h1>
          <p className="text-gray-300 text-sm">
            Ao fazer login, você concorda com nossos{' '}
            <a href="#" className="text-pink-300 hover:text-pink-200">termos</a>
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-center text-sm">
              Acesse o Boss Maids Pro
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="text-red-500" size={16} />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {demoMode && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                💡 <strong>Modo Demo:</strong> Use qualquer email/senha para entrar
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-pink-600 hover:text-pink-700">
              Esqueceu sua senha?
            </a>
          </div>
        </div>

        {/* Trial Info */}
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 text-center border-t">
          <p className="text-sm text-pink-800 font-medium">
            🎉 Faça login para acessar o Boss Maids Pro
          </p>
        </div>
      </div>
    </div>
  );
}
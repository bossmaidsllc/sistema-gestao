import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Settings, CheckCircle, X } from 'lucide-react';
import { isDemoMode, getIntegrationStatus } from '../../lib/adapters';
import { dbAdapter } from '../../lib/adapters/dbAdapter';

export default function DemoModeIndicator() {
  const [showDetails, setShowDetails] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState(getIntegrationStatus());

  const handleResetDemoData = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados demo?')) {
      dbAdapter.resetDemoData();
      window.location.reload();
    }
  };

  const handleDiagnostic = () => {
    setIntegrationStatus(getIntegrationStatus());
    setShowDetails(true);
  };

  if (!isDemoMode()) return null;

  return (
    <>
      {/* Demo Mode Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-yellow-600" size={16} />
            <span className="text-yellow-800 text-sm font-medium">
              🎭 Modo Demo Ativo - Dados simulados
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleResetDemoData}
              className="text-yellow-700 hover:text-yellow-900 text-sm flex items-center space-x-1"
            >
              <RefreshCw size={14} />
              <span>Resetar</span>
            </button>
            <button
              onClick={handleDiagnostic}
              className="text-yellow-700 hover:text-yellow-900 text-sm flex items-center space-x-1"
            >
              <Settings size={14} />
              <span>Diagnóstico</span>
            </button>
          </div>
        </div>
      </div>

      {/* Diagnostic Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">Status das Integrações</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {Object.entries(integrationStatus).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">
                      {service === 'demoMode' ? 'Modo Demo' : 
                       service === 'stripe' ? 'Stripe (Pagamentos)' :
                       service === 'sendgrid' ? 'SendGrid (Email)' :
                       service === 'twilio' ? 'Twilio (SMS)' :
                       service === 'openai' ? 'OpenAI (IA)' :
                       service === 'googlePlaces' ? 'Google Places' :
                       service}
                    </span>
                    <div className="flex items-center space-x-2">
                      {status ? (
                        <CheckCircle className="text-green-500" size={16} />
                      ) : (
                        <X className="text-red-500" size={16} />
                      )}
                      <span className={`text-sm ${status ? 'text-green-600' : 'text-red-600'}`}>
                        {status ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Para sair do modo demo:</strong><br/>
                  1. Configure as variáveis de ambiente<br/>
                  2. Clique em "Connect to Supabase" no topo<br/>
                  3. Recarregue a página
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
// Componente SplashScreen
import { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-center">
        {/* Logo animado */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-[#00A4EF] rounded-xl flex items-center justify-center mx-auto shadow-[0_4px_16px_rgba(0,164,239,0.15)] animate-pulse">
            <span className="text-white font-bold text-2xl">FC</span>
          </div>
          
          {/* Anillo de carga */}
          <div className="absolute inset-0 w-20 h-20 rounded-xl border-4 border-[#E3F2FD] mx-auto">
            <div 
              className="absolute inset-0 rounded-xl border-4 border-transparent border-t-[#00A4EF] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ 
                transform: `rotate(${loading * 3.6}deg)`,
                animation: 'spin 1s linear infinite'
              }}
            />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-[#263238] mb-2">FastCRM</h1>
        <p className="text-[#546E7A] mb-8">Sistema de Gestión de Plantillas</p>

        {/* Barra de progreso */}
        <div className="w-64 mx-auto">
          <div className="flex justify-between text-sm text-[#90A4AE] mb-2">
            <span>Cargando...</span>
            <span>{loading}%</span>
          </div>
          <div className="w-full bg-[#E3F2FD] rounded-full h-2 shadow-inner">
            <div 
              className="bg-gradient-to-r from-[#00A4EF] to-[#0D47A1] h-2 rounded-full transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_2px_8px_rgba(0,164,239,0.08)]"
              style={{ width: `${loading}%` }}
            />
          </div>
        </div>

        {/* Indicadores de características */}
        <div className="mt-12 space-y-3">
          <div className={`flex items-center gap-3 text-sm transition-all duration-300 ${loading > 20 ? 'text-[#00E676]' : 'text-[#90A4AE]'}`}>
            <div className={`w-2 h-2 rounded-full ${loading > 20 ? 'bg-[#00E676]' : 'bg-[#E3F2FD]'} transition-colors duration-300`} />
            <span>Iniciando sistema...</span>
          </div>
          <div className={`flex items-center gap-3 text-sm transition-all duration-300 ${loading > 50 ? 'text-[#00E676]' : 'text-[#90A4AE]'}`}>
            <div className={`w-2 h-2 rounded-full ${loading > 50 ? 'bg-[#00E676]' : 'bg-[#E3F2FD]'} transition-colors duration-300`} />
            <span>Cargando plantillas...</span>
          </div>
          <div className={`flex items-center gap-3 text-sm transition-all duration-300 ${loading > 80 ? 'text-[#00E676]' : 'text-[#90A4AE]'}`}>
            <div className={`w-2 h-2 rounded-full ${loading > 80 ? 'bg-[#00E676]' : 'bg-[#E3F2FD]'} transition-colors duration-300`} />
            <span>Preparando interfaz...</span>
          </div>
        </div>

        {/* Versión */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-xs text-[#90A4AE]">
            FastCRM v1.0 - Desarrollado para equipos técnicos
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
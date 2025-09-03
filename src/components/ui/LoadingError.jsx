import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const LoadingError = ({ 
  error, 
  onRetry, 
  title = "Error de carga", 
  description = "Hubo un problema al cargar la aplicación. Por favor, inténtalo de nuevo."
}) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-[0_4px_16px_rgba(0,164,239,0.15)] p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <h2 className="text-xl font-semibold text-[#263238] mb-2">
          {title}
        </h2>
        
        <p className="text-[#546E7A] mb-6">
          {description}
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6 text-left">
            <p className="text-sm text-red-700 font-medium mb-1">Error técnico:</p>
            <p className="text-xs text-red-600 break-words">{error}</p>
          </div>
        )}
        
        <Button 
          onClick={onRetry}
          className="w-full flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          Reintentar
        </Button>
      </div>
    </div>
  );
};
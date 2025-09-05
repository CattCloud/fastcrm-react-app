
import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { User, Phone, Calendar, MessageCircle, Trash2, MoreVertical } from 'lucide-react';

export const ContactCard = ({ contact, onDelete, canDelete = false, user }) => {
  const [showActions, setShowActions] = useState(false);

  const formatPhoneDisplay = (phone) => {
    // Formatear para mostrar de manera más legible
    if (phone.startsWith('+51')) {
      const number = phone.substring(3);
      return `+51 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
    return phone;
  };

  return (
    <Card hoverable className="p-4 relative">
      {/* Header con nombre y acciones */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-[#E3F2FD] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-[#00A4EF]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#263238] truncate">
              {contact.name}
            </h3>
            <p className="text-sm text-[#546E7A] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {contact.createdAt}
            </p>
          </div>
        </div>

        {/* Menú de acciones */}
        {canDelete && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
              className="text-[#90A4AE] hover:text-[#546E7A]"
            >
              <MoreVertical size={16} />
            </Button>

            {showActions && (
              <>
                {/* Overlay para cerrar el menú */}
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowActions(false)}
                />
                
                {/* Menú desplegable */}
                <div className="absolute right-0 top-8 z-20 bg-white border border-[#E3F2FD] rounded-md shadow-[0_4px_16px_rgba(0,164,239,0.15)] py-1 min-w-[140px]">
                  <button
                    onClick={() => {
                      setShowActions(false);
                      onDelete(contact);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-[#F44336] hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Información del teléfono */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-[#546E7A] mb-2">
          <Phone className="w-4 h-4" />
          <span className="font-medium text-sm">WhatsApp:</span>
        </div>
        <p className="font-mono text-[#263238] bg-[#F8FAFC] px-3 py-2 rounded border">
          {formatPhoneDisplay(contact.phone)}
        </p>
      </div>

      {/* Badge del autor (solo para admins) */}
      {user?.type === 'admin' && (
              <div className="text-xs text-[#90A4AE] flex items-center justify-between mt-2">
                     <span>Por: {contact.authorName}</span>
            </div>
      )}

      {/* Indicador de hover para tarjeta interactiva */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00A4EF] to-[#0D47A1] opacity-0 hover:opacity-5 transition-opacity duration-200 rounded-md pointer-events-none" />
    </Card>
  );
};
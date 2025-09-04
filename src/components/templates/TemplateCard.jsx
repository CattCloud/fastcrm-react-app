import { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Settings, Edit3, Trash2 } from 'lucide-react';
// Componente TemplateCard
export const TemplateCard = ({ user, template, onEdit, onDelete, canModify }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    return `Hace ${days} días`;
  };

  const getTypeColor = (type) => {
    const colors = {
      'bienvenida': 'success',
      'urgente': 'danger',
      'recordatorio': 'warning',
      'seguimiento': 'primary'
    };
    return colors[type] || 'primary';
  };

  return (
    <Card hoverable className="p-4 relative min-h-[240px] flex flex-col justify-between">
      {/* Zona superior */}
      <div className="flex items-start justify-between mb-2">
        <Badge variant={getTypeColor(template.type)}>
          {template.type}
        </Badge>

        {canModify && user?.type !== 'invitado' && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-[#546E7A] hover:text-[#263238] p-1"
            >
              <Settings size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-[#E3F2FD] rounded-md shadow-[0_4px_16px_rgba(0,164,239,0.15)] z-10">
                <button
                  onClick={() => {
                    onEdit(template);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#263238] hover:bg-[#F8FAFC]"
                >
                  <Edit3 size={14} />
                  Editar
                </button>
                <button
                  onClick={() => {
                    onDelete(template);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#F44336] hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zona media */}
      <div className="flex-grow flex flex-col justify-start gap-2">
        <p className="text-[#263238] text-sm line-clamp-3">
          {template.content}
        </p>

        <div className="flex flex-wrap gap-2">
          {template.labels.slice(0, 3).map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-[#F8FAFC] text-[#546E7A] text-xs rounded border"
            >
              {label}
            </span>
          ))}
          {template.labels.length > 3 && (
            <span className="px-2 py-1 text-[#90A4AE] text-xs">
              +{template.labels.length - 3} más
            </span>
          )}
        </div>
      </div>

      {/* Zona inferior */}
      <div className="text-xs text-[#90A4AE] flex items-center justify-between mt-2">
        <span>Por: {template.author?.name || 'Desconocido'}</span>
        <span>{formatDate(template.createdAt)}</span>
      </div>
    </Card>
  );
};
import { useState } from 'react';
import {TEMPLATE_TYPES} from '../utils/constants';
import { TemplateCard } from '../components/templates/TemplateCard';
import { Card } from '../components/ui/Card';
import { Search, Filter, Eye } from 'lucide-react'; 


// Componente principal de Templates
export const Templates = ({ user, templates, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  // Filtrar plantillas según el tipo de usuario
  const filteredTemplates = templates.filter(template => {
    if (user.type === 'admin') return true;
    if (user.type === 'invitado') return template.author.type === 'invitado';
    return template.author.type === 'usuario' && template.author.name === user.name;
  });

  const canModify = (template) => {
    if (user.type === 'admin') return true;
    if (user.type === 'invitado') return template.author.type === 'invitado';
    return template.author.name === user.name;
  };

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-bold text-[#263238]">Plantillas</h1>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#90A4AE]" />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF]"
            />
          </div>
          
          <div className="relative">
            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#90A4AE]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF] bg-white"
            >
              <option value="">Todos los tipos</option>
              {TEMPLATE_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de plantillas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <div className="text-[#90A4AE] mb-4">
                <Eye size={48} className="mx-auto mb-2" />
                <p className="text-lg">No hay plantillas disponibles</p>
                <p className="text-sm">
                  {user.type === 'invitado' 
                    ? 'Crea tu primera plantilla para comenzar'
                    : 'Inicia sesión para ver tus plantillas'
                  }
                </p>
              </div>
            </Card>
          </div>
        ) : (
          filteredTemplates.map(template => (
            <TemplateCard
              key={template._id}
              template={template}
              onEdit={onEdit}
              onDelete={onDelete}
              canModify={canModify(template)}
            />
          ))
        )}
      </div>
    </div>
  );
};
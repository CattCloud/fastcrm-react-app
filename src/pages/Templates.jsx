import { useState } from 'react';
import { TEMPLATE_TYPES } from '../utils/constants';
import { TemplateCard } from '../components/templates/TemplateCard';
import { Card } from '../components/ui/Card';
import { Search, Eraser, Filter, Eye } from 'lucide-react';
import { searchService } from '../services/searchService';
import { notify } from '../utils/notify';


export const Templates = ({ user, templates, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchedTemplates, setSearchedTemplates] = useState(null); // ← null al inicio
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.trim().length < 2) return;

    setLoading(true);
    try {
      let results = [];
      const normalizedType = filterType.trim().toLowerCase() || null;

      if (user.type === 'admin') {
        results = await searchService.searchByKeywordForAdmin(searchTerm, normalizedType);
      } else if (user.type === 'invitado') {
        results = await searchService.searchByKeywordAndRole(searchTerm, 'invitado', normalizedType);
      } else {
        results = await searchService.searchByKeywordAndAuthorId(searchTerm, user.id, normalizedType);
      }
      setSearchedTemplates(results);
    } catch (e) {
      console.error('Error en búsqueda:', e);
    } finally {
      setLoading(false);
    }
  };

  // Decide qué conjunto usar: búsqueda o inicial
  const templatesToRender = searchedTemplates ?? templates;

  // Filtro por tipo
  const filteredTemplates = templatesToRender.filter(template => {
    if (!filterType) return true;
    return template.type === filterType;
  });

  const canModify = (template) => {
    const author = template.author;
    if (user.type === 'admin') return true;
    if (user.type === 'invitado') return author?.type === 'invitado';
    return author?.name === user.name;
  };

  const handleClearSearch = () => {
    notify.success("La búsqueda se ha limpiado con exito");
    setSearchTerm('');
    setSearchedTemplates(null);
  };


  return (
    <div className="space-y-6">
      {/* Header con búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-bold text-[#263238]">Plantillas</h1>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex sm:w-64 relative">
            {/* Input */}
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF]"
            />

            {/* Botón con ícono */}
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 rounded-md text-[#00A4EF] hover:bg-[#E3F2FD]"
            >
              <Search size={18} />
            </button>
          </div>


          <button
            onClick={handleClearSearch}
            className="flex items-center gap-2 px-4 py-2 bg-[#ECEFF1] text-[#263238] rounded-md hover:bg-[#CFD8DC]"
          >
            <Eraser size={18} />

          </button>

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
        {loading ? (
          <Card className="p-12 text-center">Buscando plantillas...</Card>
        ) : filteredTemplates.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <div className="text-[#90A4AE] mb-4">
                <Eye size={48} className="mx-auto mb-2" />
                <p className="text-lg">No hay plantillas disponibles</p>
                <p className="text-sm">
                  {user.type === 'invitado'
                    ? 'Crea tu primera plantilla para comenzar'
                    : 'Inicia sesión para ver tus plantillas'}
                </p>
              </div>
            </Card>
          </div>
        ) : (
          filteredTemplates.map(template => (
            <TemplateCard
              user={user}
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
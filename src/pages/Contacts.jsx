import { useState, useEffect, useMemo } from 'react';
import { ContactCard } from '../components/contacts/ContactCard';
import { Button } from '../components/ui/Button';
import { LoadingError } from '../components/ui/LoadingError';
import {
  Users,
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  AlertCircle,
  UserPlus
} from 'lucide-react';
import { getContacts } from '../services/contactService'; // Asegúrate de que esta función acepte { orderBy, order }

export const Contacts = ({
  user,
  onCreateContact,
  onDelete,
  canCreateContact = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getContacts({ orderBy: 'createdAt', order: sortOrder });
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [sortOrder]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contacts;
    const term = searchTerm.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(term) ||
      contact.phone.includes(term)
    );
  }, [contacts, searchTerm]);

  if (error && !contacts.length) {
    return (
      <LoadingError
        error={error}
        onRetry={fetchContacts}
        title="Error al cargar contactos"
        description="No se pudieron cargar los contactos. Por favor, inténtalo de nuevo."
      />
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-[#00A4EF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#263238]">
              Contactos
            </h1>
            <p className="text-[#546E7A]">
              {loading ? 'Cargando...' : `${contacts.length} contacto${contacts.length !== 1 ? 's' : ''} registrado${contacts.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Botón crear contacto */}
        {canCreateContact && user?.type !== 'invitado' && (
          <Button 
            onClick={onCreateContact}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Plus size={18} />
            Nuevo Contacto
          </Button>
        )}
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white border border-[#E3F2FD] rounded-md p-4 shadow-[0_2px_8px_rgba(0,164,239,0.08)]">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Campo de búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#90A4AE]" />
            <input
              type="text"
              placeholder="Buscar por nombre o número..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF] text-[#263238]"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#90A4AE] hover:text-[#546E7A]"
              >
                ×
              </button>
            )}
          </div>

          {/* Controles de filtros */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleSortOrder}
              className="flex items-center gap-2"
            >
              {sortOrder === 'desc' ? <SortDesc size={16} /> : <SortAsc size={16} />}
              {sortOrder === 'desc' ? 'Más recientes' : 'Más antiguos'}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filtros
            </Button>
          </div>
        </div>

        {/* Panel de filtros expandible */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-[#E3F2FD]">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-[#546E7A] font-medium">Ordenar por:</span>
              <button
                onClick={() => setSortOrder('desc')}
                className={`text-xs px-2 py-1 rounded ${
                  sortOrder === 'desc' 
                    ? 'bg-[#00A4EF] text-white' 
                    : 'bg-[#F8FAFC] text-[#546E7A] hover:bg-[#E3F2FD]'
                }`}
              >
                Fecha (nuevo → antiguo)
              </button>
              <button
                onClick={() => setSortOrder('asc')}
                className={`text-xs px-2 py-1 rounded ${
                  sortOrder === 'asc' 
                    ? 'bg-[#00A4EF] text-white' 
                    : 'bg-[#F8FAFC] text-[#546E7A] hover:bg-[#E3F2FD]'
                }`}
              >
                Fecha (antiguo → nuevo)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas de búsqueda */}
      {searchTerm && (
        <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-md p-3">
          <p className="text-sm text-[#0D47A1]">
            {filteredContacts.length === 0 
              ? `No se encontraron contactos que coincidan con "${searchTerm}"`
              : `Mostrando ${filteredContacts.length} contacto${filteredContacts.length !== 1 ? 's' : ''} que coincide${filteredContacts.length === 1 ? '' : 'n'} con "${searchTerm}"`
            }
          </p>
        </div>
      )}

      {/* Lista de contactos */}
      {loading && !contacts.length ? (
        // Loading inicial
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00A4EF]"></div>
            <span className="text-[#546E7A]">Cargando contactos...</span>
          </div>
        </div>
      ) : filteredContacts.length === 0 && contacts.length === 0 ? (
        // Estado vacío inicial
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-[#00A4EF]" />
          </div>
          <h3 className="text-lg font-medium text-[#263238] mb-2">
            No hay contactos registrados
          </h3>
          <p className="text-[#546E7A] mb-4 max-w-md mx-auto">
            {user?.type === 'invitado' 
              ? 'Los usuarios invitados no pueden crear contactos. Inicia sesión para acceder a esta funcionalidad.'
              : 'Comienza creando tu primer contacto para mantener organizados los datos de tus clientes.'
            }
          </p>
          {canCreateContact && user?.type !== 'invitado' && (
            <Button onClick={onCreateContact} className="flex items-center gap-2">
              <Plus size={18} />
              Crear mi primer contacto
            </Button>
          )}
        </div>
      ) : filteredContacts.length === 0 ? (
        // Sin resultados de búsqueda
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-[#90A4AE] mx-auto mb-3" />
          <h3 className="text-lg font-medium text-[#263238] mb-2">
            Sin resultados
          </h3>
          <p className="text-[#546E7A]">
            No se encontraron contactos con los criterios de búsqueda.
          </p>
          <Button 
            variant="secondary" 
            onClick={clearSearch}
            className="mt-3"
          >
            Limpiar búsqueda
          </Button>
        </div>
      ) : (
        // Grid de contactos
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onDelete={onDelete}
              canDelete={user?.type !== 'invitado'}
              user={user}
            />
          ))}
        </div>
      )}

      {/* Indicador de carga para refresh */}
      {loading && contacts.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white border border-[#E3F2FD] rounded-md p-3 shadow-[0_4px_16px_rgba(0,164,239,0.15)]">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00A4EF]"></div>
            <span className="text-sm text-[#546E7A]">Actualizando...</span>
          </div>
        </div>
      )}
    </div>
  );
};
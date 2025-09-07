import { useState, useMemo } from 'react';
import { CompanyCard } from '../components/companies/CompanyCard';
import { Button } from '../components/ui/Button';
import { LoadingError } from '../components/ui/LoadingError';
import {
    Building,
    Search,
    Filter,
    SortAsc,
    SortDesc,
    AlertCircle,
    Plus
} from 'lucide-react';
import { useCompany } from '../hooks/useCompany';

export const Companies = ({
    user
}) => {
    // Usar el hook useCompany
    const {
        companies,
        loading,
        error,
        fetchCompanies
    } = useCompany(user);

    // Estados locales para UI
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    };

    const clearSearch = () => {
        setSearchTerm('');
    };



    // Filtrar y ordenar empresas
    const filteredAndSortedCompanies = useMemo(() => {
        let filtered = companies;

        // Aplicar filtro de búsqueda
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = companies.filter(company =>
                company.name.toLowerCase().includes(term) ||
                company.ruc.includes(term)
            );
        }

        // Aplicar ordenamiento
        const sorted = [...filtered].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            
            if (sortOrder === 'desc') {
                return dateB - dateA; // Más recientes primero
            } else {
                return dateA - dateB; // Más antiguos primero
            }
        });

        return sorted;
    }, [companies, searchTerm, sortOrder]);

    // Manejar errores críticos
    if (error && !companies.length) {
        return (
            <LoadingError
                error={error}
                onRetry={fetchCompanies}
                title="Error al cargar empresas"
                description="No se pudieron cargar las empresas. Por favor, inténtalo de nuevo."
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-[#00A4EF]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#263238]">
                            Empresas y Contactos
                        </h1>
                        <p className="text-[#546E7A]">
                            {loading ? 'Cargando...' : `${companies.length} empresa${companies.length !== 1 ? 's' : ''} registrada${companies.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="bg-white border border-[#E3F2FD] rounded-md p-4 shadow-[0_2px_8px_rgba(0,164,239,0.08)]">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Campo de búsqueda */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#90A4AE]" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre de empresa o RUC..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF] text-[#263238]"
                            disabled={loading}
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
                            disabled={loading}
                        >
                            {sortOrder === 'desc' ? <SortDesc size={16} /> : <SortAsc size={16} />}
                            {sortOrder === 'desc' ? 'Más recientes' : 'Más antiguos'}
                        </Button>

                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                            disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                        {filteredAndSortedCompanies.length === 0 
                            ? `No se encontraron empresas que coincidan con "${searchTerm}"`
                            : `Mostrando ${filteredAndSortedCompanies.length} empresa${filteredAndSortedCompanies.length !== 1 ? 's' : ''} que coincide${filteredAndSortedCompanies.length === 1 ? '' : 'n'} con "${searchTerm}"`
                        }
                    </p>
                </div>
            )}

            {/* Lista de empresas */}
            {loading && !companies.length ? (
                // Loading inicial
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00A4EF]"></div>
                        <span className="text-[#546E7A]">Cargando empresas...</span>
                    </div>
                </div>
            ) : filteredAndSortedCompanies.length === 0 && companies.length === 0 ? (
                // Estado vacío inicial
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-[#00A4EF]" />
                    </div>
                    <h3 className="text-lg font-medium text-[#263238] mb-2">
                        {user?.type === 'invitado' 
                            ? 'Acceso limitado'
                            : user?.type === 'admin'
                                ? 'No hay empresas registradas'
                                : 'No tienes contactos en empresas'
                        }
                    </h3>
                    <p className="text-[#546E7A] mb-4 max-w-md mx-auto">
                        {user?.type === 'invitado' 
                            ? 'Los usuarios invitados no pueden ver empresas. Inicia sesión para acceder a esta funcionalidad.'
                            : user?.type === 'admin'
                                ? 'Las empresas se crean automáticamente cuando los usuarios registran contactos con información empresarial.'
                                : 'Las empresas aparecerán aquí cuando registres contactos que pertenezcan a alguna empresa.'
                        }
                    </p>
                </div>
            ) : filteredAndSortedCompanies.length === 0 ? (
                // Sin resultados de búsqueda
                <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-[#90A4AE] mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-[#263238] mb-2">
                        Sin resultados
                    </h3>
                    <p className="text-[#546E7A]">
                        No se encontraron empresas con los criterios de búsqueda.
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
                // Grid de empresas
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredAndSortedCompanies.map((company) => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                user={user}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Indicador de carga para refresh */}
            {loading && companies.length > 0 && (
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
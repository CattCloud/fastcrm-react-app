
import { CompanyCard } from '../components/companies/CompanyCard';
import { Button } from '../components/ui/Button';
import { LoadingError } from '../components/ui/LoadingError';
import {
    Building
} from 'lucide-react';

export const Companies = ({
    user,
    companies,
    onDelete,
    loading,
    error,
    onRefresh,
}) => {

    if (error && !companies.length) {
        return (
            <LoadingError
                error={error}
                onRetry={onRefresh}
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


            {/* Lista de empresas */}
            {!loading && companies.length > 0 && (
                // Grid de empresas con información anidada
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {companies.map((company) => (
                            <CompanyCard
                                key={company.id}
                                company={company}
                                onDelete={onDelete}
                                canDelete={user?.type === 'admin'} // Solo admin puede eliminar empresas
                                user={user}
                            />
                        ))}
                    </div>
                </div>
            )}



        </div>
    );
}
import { Badge } from '../components/ui/Badge';
import { LoadingError } from '../components/ui/LoadingError';
import {
    History,
    User,
    Phone,
    MessageSquare,
    Calendar,
    Tag,
    FileText
} from 'lucide-react';
import { useContactLogs } from '../hooks/useContactLogs';

export const ContactLogs = ({ user }) => {
    const {
        logs,
        loading,
        error,
        refreshLogs
    } = useContactLogs(user);

    // Función para formatear el teléfono
    const formatPhoneDisplay = (phone) => {
        if (!phone || typeof phone !== 'string') return '—';
        if (phone.startsWith('+51')) {
            const number = phone.substring(3);
            return `+51 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
        }
        return phone;
    };

    // Función para truncar contenido
    const truncateContent = (content, maxLength = 80) => {
        if (!content) return '—';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    // Manejar errores críticos
    if (error && !logs.length) {
        return (
            <LoadingError
                error={error}
                onRetry={refreshLogs}
                title="Error al cargar historial"
                description="No se pudo cargar el historial de contactos. Por favor, inténtalo de nuevo."
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                        <History className="w-6 h-6 text-[#00A4EF]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#263238]">
                            Historial de Contactos
                        </h1>
                        <p className="text-[#546E7A]">
                            {loading ? 'Cargando...' : `${logs.length} contacto${logs.length !== 1 ? 's' : ''} registrado${logs.length !== 1 ? 's' : ''} en el historial`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            {loading && !logs.length ? (
                // Loading inicial
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00A4EF]"></div>
                        <span className="text-[#546E7A]">Cargando historial...</span>
                    </div>
                </div>
            ) : logs.length === 0 ? (
                // Estado vacío
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto mb-4">
                        <History className="w-8 h-8 text-[#00A4EF]" />
                    </div>
                    <h3 className="text-lg font-medium text-[#263238] mb-2">
                        {user?.type === 'invitado'
                            ? 'Acceso limitado'
                            : 'No hay historial disponible'
                        }
                    </h3>
                    <p className="text-[#546E7A] mb-4 max-w-md mx-auto">
                        {user?.type === 'invitado'
                            ? 'Los usuarios invitados no pueden ver el historial. Inicia sesión para acceder a esta funcionalidad.'
                            : user?.type === 'admin'
                                ? 'El historial aparecerá cuando los usuarios envíen mensajes usando las plantillas del sistema.'
                                : 'El historial aparecerá cuando envíes mensajes usando las plantillas disponibles.'
                        }
                    </p>
                </div>
            ) : (
                // Tabla responsiva
                <div className="bg-white border border-[#E3F2FD] rounded-md shadow-[0_2px_8px_rgba(0,164,239,0.08)] overflow-hidden">
                    {/* Header de tabla - Solo visible en desktop */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 bg-[#F8FAFC] border-b border-[#E3F2FD] text-sm font-medium text-[#546E7A]">
                        <div className="col-span-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Fecha</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Contacto</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>WhatsApp</span>
                        </div>
                        <div className="col-span-5 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>Plantilla usada</span>
                        </div>
                    </div>

                    {/* Filas de datos */}
                    <div className="divide-y divide-[#E3F2FD]">
                        {logs.map((log) => (
                            <div key={log.id} className="p-4 hover:bg-[#F8FAFC] transition-colors duration-200">
                                {/* Vista Desktop */}
                                <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-start">
                                    {/* Fecha */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#00A4EF] rounded-full"></div>
                                            <span className="text-sm text-[#263238] font-medium">
                                                {log.createdAt}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contacto */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-[#E3F2FD] rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-4 h-4 text-[#00A4EF]" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-[#263238] text-sm truncate">
                                                    {log.contactName}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* WhatsApp */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-[#00A4EF] flex-shrink-0" />
                                            <span className="font-mono text-sm text-[#546E7A] truncate">
                                                {formatPhoneDisplay(log.contactPhone)}
                                            </span>
                                        </div>
                                    </div>


                                    {/* Contenido */}
                                    {/* Contenido */}
                                    <div className="col-span-5 lg:col-span-6">
                                        <p className="text-sm text-[#546E7A] line-clamp-2" title={log.templateContent}>
                                            {truncateContent(log.templateContent)}
                                        </p>
                                    </div>
                                </div>

                                {/* Vista Mobile/Tablet */}
                                <div className="lg:hidden space-y-3">
                                    {/* Header móvil */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#00A4EF] rounded-full"></div>
                                            <span className="text-sm font-medium text-[#263238]">
                                                {log.createdAt}
                                            </span>
                                        </div>
                                        <Badge variant="secondary" className="capitalize text-xs">
                                            {log.templateType}
                                        </Badge>
                                    </div>

                                    {/* Información del contacto */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#E3F2FD] rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-[#00A4EF]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#263238] truncate">
                                                {log.contactName}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-[#546E7A]">
                                                <Phone className="w-3 h-3" />
                                                <span className="font-mono">
                                                    {formatPhoneDisplay(log.contactPhone)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenido de la plantilla */}
                                    <div className="bg-[#F8FAFC] border border-[#E3F2FD] rounded-md p-3">
                                        <div className="flex items-start gap-2 mb-2">
                                            <MessageSquare className="w-4 h-4 text-[#00A4EF] mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-[#546E7A] flex-1">
                                                {truncateContent(log.templateContent, 120)}
                                            </p>
                                        </div>

                                        {/* Etiquetas móvil */}
                                        {log.templateLabels.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {log.templateLabels.slice(0, 3).map((label, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {label}
                                                    </Badge>
                                                ))}
                                                {log.templateLabels.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{log.templateLabels.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Indicador de carga para refresh */}
            {loading && logs.length > 0 && (
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
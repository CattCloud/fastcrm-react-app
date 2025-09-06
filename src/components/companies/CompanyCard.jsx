
import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
    Building,
    FileText,
    Users,
    ChevronDown,
    ChevronUp,
    Trash2,
    MoreVertical,
    Calendar,
    User
} from 'lucide-react';

export const CompanyCard = ({
    company
}) => {
    const [showContacts, setShowContacts] = useState(false);

    const formatPhoneDisplay = (phone) => {
        if (!phone || typeof phone !== 'string') return '—';
        if (phone.startsWith('+51')) {
            const number = phone.substring(3);
            return `+51 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
        }
        return phone;
    };


    const formatRUC = (ruc) => {
        // Formatear RUC: 20123456789 -> 20-123456789
        return ruc.replace(/(\d{2})(\d{9})/, '$1-$2');
    };

    const contactCount = company.contacts?.length || 0;


    return (
        <Card hoverable className="p-4 relative">

            {/* Header con información de la empresa */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-[#E3F2FD] rounded-xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-[#00A4EF]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#263238] truncate text-lg">
                            {company.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[#546E7A] mt-1">
                            <FileText className="w-3 h-3" />
                            <span className="font-mono">{formatRUC(company.ruc)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#90A4AE] mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>Creada el {company.createdAt}</span>
                        </div>
                    </div>
                </div>


            </div>

            {/* Estadísticas de contactos */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#00A4EF]" />
                    <span className="text-sm font-medium text-[#263238]">
                        {contactCount} contacto{contactCount !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Botón para mostrar/ocultar contactos */}
                {contactCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowContacts(!showContacts)}
                        className="text-[#00A4EF] hover:bg-[#E3F2FD] flex items-center gap-1"
                    >
                        {showContacts ? (
                            <>
                                <ChevronUp size={14} />
                                Ocultar
                            </>
                        ) : (
                            <>
                                <ChevronDown size={14} />
                                Ver contactos
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* Lista de contactos expandible */}
            {showContacts && contactCount > 0 && (
                <div className="border-t border-[#E3F2FD] pt-4 space-y-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {company.contacts.map((contact, index) => {
                            return (
                                <div
                                    key={contact.id || index}
                                    className="bg-[#F8FAFC] border border-[#E3F2FD] rounded-md p-3 hover:bg-[#E3F2FD] transition-colors duration-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <div className="w-8 h-8 bg-[#E3F2FD] rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-4 h-4 text-[#00A4EF]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-[#263238] truncate text-sm">
                                                    {contact.name}
                                                </p>
                                                <p className="text-xs text-[#546E7A] font-mono">
                                                    {formatPhoneDisplay(contact.phone)}
                                                </p>
                                                {contact.authorName && (
                                                    <p className="text-xs text-[#90A4AE]">
                                                        Por: {contact.authorName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Indicador visual de empresa activa */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00A4EF] to-[#0D47A1] opacity-0 hover:opacity-5 transition-opacity duration-200 rounded-md pointer-events-none" />        </Card>
    );
};
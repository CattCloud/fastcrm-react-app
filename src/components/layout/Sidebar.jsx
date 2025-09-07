// src/components/layout/Sidebar.jsx
import { X, FileText, Users, Plus, UserPlus,Building ,History} from 'lucide-react';

export const Sidebar = ({
  isOpen,
  onClose,
  currentPage,
  onPageChange,
  user
}) => {
  // Elementos del menú según el tipo de usuario
  const getMenuItems = () => {
    const baseItems = [
      {
        id: 'templates',
        label: 'Plantillas',
        icon: FileText
      },

    ];

    // Solo mostrar contactos a usuarios logueados (no invitados)
    if (user && user.type !== 'invitado') {
      baseItems.push({
        id: 'contacts',
        label: 'Contactos',
        icon: Users
      }, {
        id: 'companies',
        label: 'Empresas',
        icon: Building 
      },
      {
        id: 'contact-logs',
        label: 'Historial de Contactos',
        icon: History 
      }
    
    );

    }

    return baseItems;
  };

  // Acciones rápidas según el tipo de usuario
  const getQuickActions = () => {
    const actions = [];

    // Crear plantilla (disponible para todos)
    actions.push({
      id: 'create-template',
      label: 'Nueva Plantilla',
      icon: Plus,
      onClick: () => {
        onPageChange('create');
        onClose();
      }
    });

    // Crear contacto (solo para usuarios logueados)
    if (user && user.type !== 'invitado') {
      actions.push({
        id: 'create-contact',
        label: 'Nuevo Contacto',
        icon: UserPlus,
        onClick: () => {
          onPageChange('create-contact');
          onClose();
        }
      });
    }

    return actions;
  };

  const handleMenuClick = (pageId) => {
    onPageChange(pageId);
    onClose(); // Cerrar sidebar en móvil
  };

  const menuItems = getMenuItems();
  const quickActions = getQuickActions();

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white border-r border-[#E3F2FD] 
        shadow-[0_4px_16px_rgba(0,164,239,0.15)] z-50 
        transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>

        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-[#E3F2FD] lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00A4EF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <span className="font-semibold text-[#263238]">FastCRM</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#546E7A] hover:text-[#263238] p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Información del usuario */}
        <div className="p-4 border-b border-[#E3F2FD]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user?.type === 'admin'
                ? 'bg-gradient-to-r from-purple-400 to-purple-600'
                : user?.type === 'usuario'
                  ? 'bg-gradient-to-r from-[#00A4EF] to-[#0D47A1]'
                  : 'bg-gradient-to-r from-gray-400 to-gray-600'
              }`}>
              <span className="text-white font-medium text-sm">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#263238] truncate">
                {user?.name || 'Usuario'}
              </p>
              <p className={`text-xs capitalize ${user?.type === 'admin' ? 'text-purple-600' :
                  user?.type === 'usuario' ? 'text-[#00A4EF]' :
                    'text-[#90A4AE]'
                }`}>
                {user?.type || 'invitado'}
              </p>
            </div>
          </div>
        </div>

        {/* Navegación principal */}
        <nav className="p-4">
          <h3 className="text-xs font-semibold text-[#90A4AE] uppercase tracking-wider mb-3">
            Navegación
          </h3>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                      transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${isActive
                        ? 'bg-[#E3F2FD] text-[#00A4EF] shadow-[0_2px_8px_rgba(0,164,239,0.08)]'
                        : 'text-[#546E7A] hover:bg-[#F8FAFC] hover:text-[#263238]'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Acciones rápidas */}
        {quickActions.length > 0 && (
          <div className="p-4 border-t border-[#E3F2FD]">
            <h3 className="text-xs font-semibold text-[#90A4AE] uppercase tracking-wider mb-3">
              Acciones Rápidas
            </h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#00A4EF] 
                             hover:bg-[#E3F2FD] rounded-md transition-all duration-200 
                             ease-[cubic-bezier(0.4,0,0.2,1)] font-medium"
                  >
                    <Icon size={16} />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Información adicional para invitados */}
        {user?.type === 'invitado' && (
          <div className="p-4 border-t border-[#E3F2FD] mt-auto">
            <div className="bg-[#E3F2FD] border border-[#BBDEFB] rounded-md p-3">
              <p className="text-xs text-[#0D47A1] font-medium mb-1">
                Cuenta de Invitado
              </p>
              <p className="text-xs text-[#546E7A]">
                Inicia sesión para acceder a todas las funcionalidades como la gestión de contactos.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
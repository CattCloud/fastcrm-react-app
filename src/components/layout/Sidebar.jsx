// Componente Sidebar
import { User, X, Plus, Eye } from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, currentPage, onPageChange, user }) => {
  const menuItems = [
    { id: 'templates', label: 'Plantillas', icon: Eye },
    { id: 'create', label: 'Crear Plantilla', icon: Plus }
  ];

  return (
    <>
      
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-[#E3F2FD] shadow-[0_2px_8px_rgba(0,164,239,0.08)]
        transform transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
           
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00A4EF] rounded-md flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
              <span className="font-medium text-[#263238]">
                
                {
                user.type === 'invitado' ? 'Invitado' : user.name
                }
              </span>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden text-[#546E7A] hover:text-[#263238]"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-md text-left
                    transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isActive 
                      ? 'bg-[#E3F2FD] text-[#0D47A1] font-medium' 
                      : 'text-[#546E7A] hover:bg-[#F8FAFC] hover:text-[#263238]'
                    }
                  `}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
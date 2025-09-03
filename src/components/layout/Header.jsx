// Componente Header
import { useState } from 'react';
import { Menu, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';    

export const Header = ({ user, onLogin, onLogout, onToggleSidebar }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username && loginForm.password) {
      onLogin({ name: loginForm.username, id: Date.now().toString() });
      setShowLoginModal(false);
      setLoginForm({ username: '', password: '' });
    }
  };

  return (
    <>
      <header className="bg-white border-b border-[#E3F2FD] px-4 py-3 flex items-center justify-between shadow-[0_2px_8px_rgba(0,164,239,0.08)]">
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar}
            className="lg:hidden text-[#546E7A] hover:text-[#263238]"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00A4EF] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <h1 className="text-xl font-bold text-[#263238]">FastCRM</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User size={16} className="text-[#546E7A]" />
            <span className="text-[#546E7A]">
              {user.type === 'invitado' ? 'INVITADO' : user.name}
            </span>
          </div>
          
          {user.type === 'invitado' ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2"
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="flex items-center gap-2 text-[#F44336] hover:text-red-700"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          )}
        </div>
      </header>

      <Modal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        title="Iniciar Sesión"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              className="w-full px-3 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF]"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full px-3 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF]"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
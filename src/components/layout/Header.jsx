// components/layout/Header.jsx - Updated with login and register functionality
import { useState } from 'react';
import { Menu, User, LogIn, LogOut, UserPlus, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const Header = ({ user, onLogin, onRegister, onLogout, onToggleSidebar, loading }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset forms when modals close
  const resetForms = () => {
    setLoginForm({ username: '', password: '' });
    setRegisterForm({ username: '', password: '', confirmPassword: '' });
    setFormErrors({});
    setIsSubmitting(false);
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!loginForm.username.trim() || !loginForm.password) {
      setFormErrors({ general: 'Por favor completa todos los campos' });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await onLogin({
        username: loginForm.username.trim(),
        password: loginForm.password
      });

      if (result.success) {
        setShowLoginModal(false);
        resetForms();
      } else {
        setFormErrors({ general: result.error || 'Error en el inicio de sesión' });
      }
    } catch (error) {
      console.log(error);
      setFormErrors({ general: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    setFormErrors({});

    // Validation
    const errors = {};
    if (!registerForm.username.trim()) {
      errors.username = 'El usuario es requerido';
    } else if (registerForm.username.trim().length < 3) {
      errors.username = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!registerForm.password) {
      errors.password = 'La contraseña es requerida';
    } else if (registerForm.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await onRegister({
        username: registerForm.username.trim(),
        password: registerForm.password
      });

      if (result.success) {
        setShowRegisterModal(false);
        resetForms();
      } else {
        setFormErrors({ general: result.error || 'Error en el registro' });
      }
    } catch (error) {
      console.log(error);
      setFormErrors({ general: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-[#E3F2FD] px-4 py-3 flex items-center justify-between shadow-[0_2px_8px_rgba(0,164,239,0.08)]">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden text-[#546E7A] hover:text-[#263238] transition-colors"
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
          {
            /*
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-[#546E7A]" />
                <span className="text-[#546E7A]">
                  {user?.type === 'invitado' ? 'INVITADO' : user?.name || 'Usuario'}
                </span>
              </div>
            */
          }


          {user?.type === 'invitado' ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRegisterModal(true)}
                className="flex items-center gap-2 text-[#00A4EF] hover:text-[#0D47A1]"
                disabled={loading}
              >
                <UserPlus size={16} />
                <span className="hidden sm:inline">Registrarse</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Iniciar Sesión</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#F44336] hover:text-red-700"
              disabled={loading}
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          )}
        </div>
      </header>

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          resetForms();
        }}
        title="Iniciar Sesión"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          {formErrors.general && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{formErrors.general}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="w-full px-3 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF] transition-colors"
              placeholder="Ingresa tu usuario"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="w-full px-3 py-2 border border-[#E3F2FD] rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] focus:border-[#00A4EF] transition-colors"
              placeholder="Ingresa tu contraseña"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowLoginModal(false);
                resetForms();
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-4 border-t border-[#E3F2FD]">
            <p className="text-xs text-[#90A4AE] mb-3 text-center font-medium">
              Cuentas de prueba disponibles
            </p>
            <div className="space-y-2">
              <div className="bg-[#E3F2FD] rounded-md p-3">
                <p className="text-xs font-semibold text-[#0D47A1] mb-1"> Administrador</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#546E7A]">Usuario:</span>
                  <code className="bg-white px-2 py-1 rounded text-[#263238] font-mono">admin</code>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-[#546E7A]">Contraseña:</span>
                  <code className="bg-white px-2 py-1 rounded text-[#263238] font-mono">Admin2024!</code>
                </div>
              </div>

              <div className="bg-[#F8FAFC] rounded-md p-3 border border-[#E3F2FD]">
                <p className="text-xs font-semibold text-[#00A4EF] mb-1"> Usuario Demo</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#546E7A]">Usuario:</span>
                  <code className="bg-white px-2 py-1 rounded text-[#263238] font-mono">demo_user</code>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-[#546E7A]">Contraseña:</span>
                  <code className="bg-white px-2 py-1 rounded text-[#263238] font-mono">Demo2024!</code>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={showRegisterModal}
        onClose={() => {
          setShowRegisterModal(false);
          resetForms();
        }}
        title="Crear Cuenta"
      >
        <form onSubmit={handleRegister} className="space-y-4">
          {formErrors.general && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{formErrors.general}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] transition-colors ${formErrors.username
                ? 'border-red-300 focus:border-red-500'
                : 'border-[#E3F2FD] focus:border-[#00A4EF]'
                }`}
              placeholder="Elige un nombre de usuario"
              required
              disabled={isSubmitting}
            />
            {formErrors.username && (
              <p className="text-red-600 text-xs mt-1">{formErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] transition-colors ${formErrors.password
                ? 'border-red-300 focus:border-red-500'
                : 'border-[#E3F2FD] focus:border-[#00A4EF]'
                }`}
              placeholder="Crea una contraseña segura"
              required
              disabled={isSubmitting}
            />
            {formErrors.password && (
              <p className="text-red-600 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#263238] mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)] transition-colors ${formErrors.confirmPassword
                ? 'border-red-300 focus:border-red-500'
                : 'border-[#E3F2FD] focus:border-[#00A4EF]'
                }`}
              placeholder="Confirma tu contraseña"
              required
              disabled={isSubmitting}
            />
            {formErrors.confirmPassword && (
              <p className="text-red-600 text-xs mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowRegisterModal(false);
                resetForms();
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Cuenta'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
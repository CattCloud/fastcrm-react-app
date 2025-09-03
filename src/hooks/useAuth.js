// hooks/useAuth.js (Hook actualizado para usar la API)

import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuthStorage } from './useLocalStorage';

export const useAuth = () => {
  const { user: savedUser, saveUser, logout: clearStorage } = useAuthStorage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicializar usuario al cargar la app
  // Inicializar usuario al cargar la app
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        if (savedUser && savedUser.type !== 'invitado') {
          setUser(savedUser); // Usuario logueado 
        } else {
          const guestUser = await authService.getGuestUser(); // Usuario invitado por defecto
          setUser(guestUser);
        }

      } catch (error) {
        console.error('Error al inicializar usuario:', error);
        setError('Error al cargar la aplicación');

        // Fallback defensivo
        setUser({
          id: '68b32dccd8f3dc2924b21840',
          name: 'invitado',
          type: 'invitado'
        });
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);



  // Login
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const loggedUser = await authService.loginUser(credentials);

      // Guardar en localStorage y estado
      saveUser(loggedUser);
      setUser(loggedUser);

      return { success: true, user: loggedUser };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      await authService.registerUser(userData);

      // Después del registro, hacer login automático
      const loginResult = await login({
        username: userData.username,
        password: userData.password
      });

      return loginResult;
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);

      // Limpiar localStorage
      clearStorage();

      // Cargar usuario invitado
      const guestUser = await authService.getGuestUser();
      setUser(guestUser);

    } catch (error) {
      console.error('Error al hacer logout:', error);
      // Fallback a invitado local
      setUser({
        id: '68b32dccd8f3dc2924b21840',
        name: 'invitado',
        type: 'invitado'
      });
    } finally {
      setLoading(false);
    }
  };

  // Verificar permisos
  const canModifyTemplate = (template) => {
    if (!user || !template) return false;

    if (user.type === 'admin') return true;
    if (user.type === 'invitado') return false;

    const templateAuthorId = template.author?.id || template.author;
    const userId = user.id;

    console.log('[PERMISOS] Comparando autor:', {
      templateAuthorId,
      userId,
      resultado: String(templateAuthorId) === String(userId)
    });

    return String(templateAuthorId) === String(userId);
  };


  const canViewTemplate = (template) => {
    if (!user || !template) return false;

    if (user.type === 'admin') return true;
    if (user.type === 'invitado') return template.authorRole === 'invitado';

    const templateAuthorId = template.author?.id || template.author;
    return String(templateAuthorId) === String(user.id);
  };


  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    canModifyTemplate,
    canViewTemplate,
    isLoggedIn: user?.type !== 'invitado'
  };
};
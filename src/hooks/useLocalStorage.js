import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Función para obtener el valor inicial
  const getInitialValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error al leer localStorage con key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getInitialValue);

  // Función para actualizar el valor
  const setValue = (value) => {
    try {
      // Permite que value sea una función como en useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (valueToStore === null || valueToStore === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error al escribir en localStorage con key "${key}":`, error);
    }
  };

  // Función para limpiar el valor
  const removeValue = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error al eliminar localStorage con key "${key}":`, error);
    }
  };

  // Función para obtener el valor actual sin estado reactivo
  const getValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error al leer localStorage con key "${key}":`, error);
      return initialValue;
    }
  };

  // Escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error('Error al procesar cambio de localStorage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, getValue];
};

// Hook específico para autenticación
export const useAuthStorage = () => {
  const [user, setUser, removeUser, getUser] = useLocalStorage('fastcrm_user', null);

  const saveUser = (userData) => {
    const userToSave = {
      ...userData,
      loginTimestamp: Date.now()
    };
    setUser(userToSave);
  };

  const logout = () => {
    removeUser();
  };

  const isLoggedIn = () => {
    const currentUser = getUser();
    return currentUser && currentUser.type !== 'invitado';
  };

  const getUserRole = () => {
    const currentUser = getUser();
    return currentUser?.type || 'invitado';
  };

  return {
    user,
    saveUser,
    logout,
    isLoggedIn,
    getUserRole,
    getUser
  };
};
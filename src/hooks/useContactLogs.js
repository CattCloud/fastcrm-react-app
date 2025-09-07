import { useState, useEffect } from 'react';
import {
  createContactLog,
  getAllContactLogs,
  getContactLogsByAuthorId
} from '../services/contactLogService';

export const useContactLogs = (user) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar logs según tipo de usuario
  const fetchLogs = async () => {
    if (!user || user.type === 'invitado') {
      setLogs([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let fetchedLogs = [];

      if (user.type === 'admin') {
        fetchedLogs = await getAllContactLogs();
      } else {
        fetchedLogs = await getContactLogsByAuthorId(user.id);
      }

      setLogs(fetchedLogs);
    } catch (err) {
      console.error('Error al cargar logs:', err);
      setError(err.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo log
  const handleCreateLog = async (logData) => {
    try {
      setLoading(true);
      setError(null);

      const newLog = await createContactLog(logData);
      setLogs(prev => [newLog, ...prev]);

      return { success: true, log: newLog };
    } catch (err) {
      console.error('Error al crear log:', err);
      setError(err.message);
      return {
        success: false,
        error: err.message,
        type: err.message.includes('duplicate') ? 'duplicate' : 'general'
      };
    } finally {
      setLoading(false);
    }
  };



  // Refrescar logs
  const refreshLogs = async () => {
    await fetchLogs();
  };



  // Efecto reactivo
  useEffect(() => {
    fetchLogs();
  }, [user]);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    createLog: handleCreateLog,
    refreshLogs
  };
};
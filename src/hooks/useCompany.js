import { useState, useEffect } from 'react';
import {
  createCompany,
  getCompanies,
  findCompanyById,
  deleteCompany,
  getCompaniesByAuthor
} from '../services/companyService';

export const useCompany = (user = null) => {
  // Estados principales
  const [companies, setCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]); // Para sugerencias
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener empresas según el tipo de usuario (para la página Companies)
  const fetchCompanies = async () => {
    if (!user || user.type === 'invitado') {
      setCompanies([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result = [];

      if (user.type === 'admin') {
        // Admin ve todas las empresas
        result = await getCompanies();
      } else {
        // Usuario normal ve solo empresas donde tiene contactos
        result = await getCompaniesByAuthor(user.id);
      }

      console.log(`Empresas obtenidas para ${user.type}:`, result);
      setCompanies(result);
    } catch (err) {
      console.error('Error al cargar empresas:', err);
      setError(err.message);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas las empresas (para sugerencias en formularios)
  const fetchAllCompanies = async () => {
    try {
      const result = await getCompanies();
      setAllCompanies(result);
      return result;
    } catch (err) {
      console.error('Error al cargar todas las empresas:', err);
      return [];
    }
  };

  // Crear una nueva empresa
  const handleCreateCompany = async (companyData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newCompany = await createCompany(companyData);
      
      // Actualizar ambos estados
      setCompanies(prev => [newCompany, ...prev]);
      setAllCompanies(prev => [newCompany, ...prev]);

      return { success: true, company: newCompany };
    } catch (err) {
      console.error('Error al crear empresa:', err);
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

  // Eliminar empresa
  const handleDeleteCompany = async (companyId) => {
    try {
      setLoading(true);
      setError(null);

      await deleteCompany(companyId);
      
      // Actualizar ambos estados
      setCompanies(prev => prev.filter(c => c.id !== companyId));
      setAllCompanies(prev => prev.filter(c => c.id !== companyId));

      return { success: true };
    } catch (err) {
      console.error('Error al eliminar empresa:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Buscar empresa por ID
  const getCompanyById = async (id) => {
    try {
      const company = await findCompanyById(id);
      return company;
    } catch (err) {
      console.error('Error al buscar empresa:', err);
      return null;
    }
  };

  // Buscar empresas por término
  const searchCompanies = (term) => {
    if (!term.trim()) return companies;
    const lower = term.toLowerCase();
    return companies.filter(c => c.name.toLowerCase().includes(lower));
  };

  // Obtener sugerencias de nombres de empresas
  const getCompanySuggestions = () => {
    return allCompanies.map(c => c.name);
  };

  // Efecto para cargar empresas cuando cambie el usuario
  useEffect(() => {
    fetchCompanies();
  }, [user]);

  // Efecto para cargar todas las empresas al inicio (para sugerencias)
  useEffect(() => {
    fetchAllCompanies();
  }, []);

  return {
    // Estados principales
    companies, // Empresas filtradas según el usuario
    allCompanies, // Todas las empresas (para sugerencias)
    loading,
    error,
    
    // Funciones
    fetchCompanies,
    fetchAllCompanies,
    createCompany: handleCreateCompany,
    deleteCompany: handleDeleteCompany,
    getCompanyById,
    searchCompanies,
    getCompanySuggestions
  };
};
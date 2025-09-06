import { useState, useEffect } from 'react';
import {
  createCompany,
  getCompanies,
  findCompanyById,
  deleteCompany
} from '../services/companyService';

export const useCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las empresas
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getCompanies();
      setCompanies(result);
    } catch (err) {
      console.error('Error al cargar empresas:', err);
      setError(err.message);
      setCompanies([]); // Fallback defensivo
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva empresa
  const handleCreateCompany = async (companyData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newCompany = await createCompany(companyData);
      setCompanies(prev => [newCompany, ...prev]);

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
      setCompanies(prev => prev.filter(c => c.id !== companyId));

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

  // Efecto inicial
  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    createCompany: handleCreateCompany,
    deleteCompany: handleDeleteCompany,
    getCompanyById,
    searchCompanies
  };
};
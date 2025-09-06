const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
import { convertContact } from './contactService.js';


function convertCompany(rawCompany) {
  return {
    id: rawCompany._id || rawCompany.id,
    name: rawCompany.name,
    ruc: rawCompany.ruc,
    contacts: Array.isArray(rawCompany.contacts)
      ? rawCompany.contacts.map(convertContact)
      : [],
    createdAt: new Date(rawCompany.createdAt).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  };
}


export async function createCompany(data) {
  try {
    console.log("Datos enviados:",data);
    const response = await fetch(`${API_BASE_URL}/company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name , ruc: data.ruc})
    });


    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear empresa');
    }

    const result = await response.json();
    return convertCompany(result.company);
  } catch (err) {
    console.error('createCompany error:', err);
    throw new Error(err.message || 'Error inesperado al crear empresa');
  }
}

export async function getCompanies() {
  try {
    const response = await fetch(`${API_BASE_URL}/company`);
    if (!response.ok) {
      throw new Error('Error al obtener empresas');
    }

    const result = await response.json();
    return result.companies.map(convertCompany);
  } catch (err) {
    console.error('getCompanies error:', err);
    throw new Error(err.message || 'Error inesperado al obtener empresas');
  }
}

export async function findCompanyById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/company/${id}`);
    if (!response.ok) {
      throw new Error('Empresa no encontrada');
    }

    const result = await response.json();
    return convertCompany(result.company);
  } catch (err) {
    console.error('findCompanyById error:', err);
    throw new Error(err.message || 'Error inesperado al buscar empresa');
  }
}

export async function deleteCompany(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/company/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar empresa');
    }

    return true;
  } catch (err) {
    console.error('deleteCompany error:', err);
    throw new Error(err.message || 'Error inesperado al eliminar empresa');
  }
}
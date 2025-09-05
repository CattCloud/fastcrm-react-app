import { useState, useEffect } from 'react';
import { 
  createContact, 
  getContacts, 
  deleteContact, 
  getContactsByAuthor 
} from '../services/contactService';

export const useContacts = (user) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener contactos según el tipo de usuario
  const fetchContacts = async () => {
    if (!user || user.type === 'invitado') {
      setContacts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let fetchedContacts = [];

      if (user.type === 'admin') {
        // Admin ve todos los contactos
        fetchedContacts = await getContacts();
      } else {
        // Usuario normal ve solo sus contactos
        fetchedContacts = await getContactsByAuthor(user.id);
      }

      console.log('Contactos obtenidos:', fetchedContacts);
      setContacts(fetchedContacts);
    } catch (err) {
      console.error('Error al cargar contactos:', err);
      setError(err.message);
      
      // Fallback defensivo - array vacío
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo contacto
  const handleCreateContact = async (contactData) => {
    try {
      setLoading(true);
      setError(null);

      const newContact = await createContact(contactData);
      
      // Agregar el nuevo contacto al estado
      setContacts(prev => [newContact, ...prev]);
      
      return { success: true, contact: newContact };
    } catch (err) {
      console.error('Error al crear contacto:', err);
      setError(err.message);
      return { 
        success: false, 
        error: err.message,
        type: err.message.includes('UNIQUE constraint failed') || err.message.includes('duplicate') 
          ? 'duplicate' 
          : 'general'
      };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un contacto
  const handleDeleteContact = async (contactId) => {
    try {
      setLoading(true);
      setError(null);

      await deleteContact(contactId);
      
      // Remover el contacto del estado
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      
      return { success: true };
    } catch (err) {
      console.error('Error al eliminar contacto:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Refrescar la lista de contactos
  const refreshContacts = async () => {
    await fetchContacts();
  };

  // Buscar contactos por término
  const searchContacts = (searchTerm) => {
    if (!searchTerm.trim()) {
      return contacts;
    }

    const term = searchTerm.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(term) ||
      contact.phone.includes(term)
    );
  };

  // Verificar si el usuario puede crear contactos
  const canCreateContact = () => {
    return user && user.type !== 'invitado';
  };

  // Verificar si el usuario puede eliminar un contacto específico
  const canDeleteContact = (contact) => {
    if (!user || user.type === 'invitado') return false;
    if (user.type === 'admin') return true;
    return contact.authorId === user.id;
  };

  // Obtener estadísticas de contactos
  const getContactStats = () => {
    const total = contacts.length;
    const today = new Date().toDateString();
    const createdToday = contacts.filter(contact => 
      new Date(contact.createdAt).toDateString() === today
    ).length;

    return {
      total,
      createdToday,
      hasContacts: total > 0
    };
  };

  // Efecto para cargar contactos cuando cambie el usuario
  useEffect(() => {
    fetchContacts();
  }, [user]);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact: handleCreateContact,
    deleteContact: handleDeleteContact,
    refreshContacts,
    searchContacts,
    canCreateContact,
    canDeleteContact,
    getContactStats
  };
};
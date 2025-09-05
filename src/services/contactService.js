const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

function convertContact(rawContact) {
  return {
    id: rawContact.id,
    name: rawContact.name,
    phone: rawContact.whatsapp,
    authorId: rawContact.authorId,
    createdAt: new Date(rawContact.createdAt).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  };
}

export async function createContact(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        whatsapp: data.whatsapp,
        authorId: data.authorId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear contacto');
    }

    const result = await response.json();
    return convertContact(result.contact);
  } catch (err) {
    console.error('createContact error:', err);
    throw new Error(err.message || 'Error inesperado al crear contacto');
  }
}

export async function getContacts() {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`);
    if (!response.ok) {
      throw new Error('Error al obtener contactos');
    }
    const result = await response.json();
    return result.map(convertContact);
  } catch (err) {
    console.error('getContacts error:', err);
    throw new Error(err.message || 'Error inesperado al obtener contactos');
  }
}

export async function deleteContact(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar contacto');
    }

    return true;
  } catch (err) {
    console.error('deleteContact error:', err);
    throw new Error(err.message || 'Error inesperado al eliminar contacto');
  }
}

export async function getContactsByAuthor(authorId) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/author/${authorId}`);
    if (!response.ok) {
      throw new Error('Error al obtener contactos del autor');
    }
    const result = await response.json();
    return result.contacts.map(convertContact);
  } catch (err) {
    console.error('getContactsByAuthor error:', err);
    throw new Error(err.message || 'Error inesperado al obtener contactos del autor');
  }
}
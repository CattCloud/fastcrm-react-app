const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const BASE_URL = `${API_BASE_URL}/contactlog`;

export function convertContactLog(rawLog) {
  const contact = rawLog.contact || {};
  const template = rawLog.template || {};
  return {
    id: rawLog.id,
    contactId: rawLog.contactId,
    templateId: rawLog.templateId,
    createdAt: new Date(rawLog.createdAt).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),

    // Datos del contacto
    contactName: contact.name || 'Sin nombre',
    contactPhone: contact.whatsapp || '',
    authorId: contact.authorId || null,

    // Datos de la plantilla
    templateType: template.type || 'sin tipo',
    templateContent: template.content || '',
    templateLabels: Array.isArray(template.labels) ? template.labels : [],
    templateCreatedAt: template.createdAt
      ? new Date(template.createdAt).toLocaleDateString('es-PE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : null,
  };
}


export async function createContactLog(payload) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const error = await res.json();
      throw error;
    }

    const data = await res.json();
    return data.log;
  } catch (error) {
    console.error('Error createContactLog:', error);
    throw error;
  }
}

export async function getAllContactLogs() {
  try {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
      const error = await res.json();
      throw error;
    }

    const rawLogs = await res.json();
    return rawLogs.map(convertContactLog);
  } catch (error) {
    console.error('Error getAllContactLogs:', error);
    throw error;
  }
}
export async function getContactLogsByAuthorId(authorId) {
  try {
    const res = await fetch(`${BASE_URL}/author/${authorId}`);

    if (!res.ok) {
      const error = await res.json();
      throw error;
    }

    const rawLogs = await res.json();
    return rawLogs.map(convertContactLog);
  } catch (error) {
    console.error('Error getContactLogsByAuthorId:', error);
    throw error;
  }
}

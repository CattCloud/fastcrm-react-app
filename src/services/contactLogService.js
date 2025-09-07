const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const BASE_URL = `${API_BASE_URL}/contactlog`;


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

    const logs = await res.json();
    return logs;
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

    const logs = await res.json();
    return logs;
  } catch (error) {
    console.error('Error getContactLogsByAuthorId:', error);
    throw error;
  }
}

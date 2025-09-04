const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

const convertApiTemplateToAppTemplate = (apiTemplate) => {
  const autor = apiTemplate.author;
  const normalizedAuthor = autor && typeof autor === 'object' ? {
    id: autor._id,
    name: autor.username,
    type: autor.role,
    accessCount: autor.accessCount,
    isActive: autor.isActive,
    createdAt: autor.createdAt,
    updatedAt: autor.updatedAt
  } : null;

  return {
    _id: apiTemplate._id,
    type: apiTemplate.type,
    content: apiTemplate.content,
    labels: apiTemplate.labels || [],
    author: normalizedAuthor,
    authorRole: apiTemplate.authorRole,
    createdAt: new Date(apiTemplate.createdAt),
    updatedAt: apiTemplate.updatedAt ? new Date(apiTemplate.updatedAt) : null
  };
};

export const searchService = {
  async searchByKeywordAndAuthorId(keyword, authorId, type = null) {
    try {
      const params = new URLSearchParams({
        q: keyword,
        id: authorId,
        ...(type && { type })
      });

      const response = await fetch(`${API_BASE_URL}/template/search?${params.toString()}`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return data.map(convertApiTemplateToAppTemplate);
    } catch (e) {
      console.error('Error en búsqueda por autor:', e);
      throw e;
    }
  },

  async searchByKeywordAndRole(keyword, role, type = null) {
    try {
      const params = new URLSearchParams({
        q: keyword,
        role,
        ...(type && { type })
      });

      const response = await fetch(`${API_BASE_URL}/template/search/role?${params.toString()}`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return data.map(convertApiTemplateToAppTemplate);
    } catch (e) {
      console.error('Error en búsqueda por rol:', e);
      throw e;
    }
  },

  async searchByKeywordForAdmin(keyword, type = null) {
    try {
      const params = new URLSearchParams({
        q: keyword,
        ...(type && { type })
      });

      const response = await fetch(`${API_BASE_URL}/template/search/admin?${params.toString()}`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      return data.map(convertApiTemplateToAppTemplate);
    } catch (e) {
      console.error('Error en búsqueda para admin:', e);
      throw e;
    }
  }
};
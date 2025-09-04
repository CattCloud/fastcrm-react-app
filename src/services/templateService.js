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

const convertAppTemplateToApiTemplate = (appTemplate) => ({
    type: appTemplate.type,
    content: appTemplate.content,
    labels: appTemplate.labels || [],
    author: appTemplate.author,
    authorRole: appTemplate.authorRole || 'invitado'
});

export const templateService = {
    async fetchAllTemplates() {
        try {
            const response = await fetch(`${API_BASE_URL}/template`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

            const templatesArray = await response.json();

            if (!Array.isArray(templatesArray)) {
                throw new Error('La respuesta del servidor no es un array de plantillas');
            }

            return templatesArray.map(convertApiTemplateToAppTemplate);
        } catch (error) {
            console.error('Error al obtener templates:', error);
            throw error;
        }
    },

    async fetchTemplatesByRole(role) {
        try {
            const response = await fetch(`${API_BASE_URL}/template/rol/${role}`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.message}`);
            const data = await response.json();
            //console.log("Plantillas por rol obtenidas:", data);
            return data.map(convertApiTemplateToAppTemplate);
        } catch (e) {
            console.error("Error al obtener plantillas por rol", e);
        }

    },

    async fetchTemplatesByAuthor(authorId) {
        try {
            const response = await fetch(`${API_BASE_URL}/template/author/${authorId}`);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.message}`);
            const data = await response.json();
            return data.map(convertApiTemplateToAppTemplate);
        } catch (e) {
            console.error('Error al obtener plantillas por autor', e);
        }

    },

    async createTemplate(templateData) {
        try {
            const apiTemplate = convertAppTemplateToApiTemplate(templateData);
            const response = await fetch(`${API_BASE_URL}/template`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiTemplate)
            });
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.message}`);
            const data = await response.json();
            return convertApiTemplateToAppTemplate(data);
        } catch (e) {
            console.error('Error al crear plantilla', e);
        }

    },

    async updateTemplate(templateId, templateData) {
        try {
            const camposPermitidos = ['type', 'content', 'labels'];
            const apiTemplate = Object.fromEntries(
                Object.entries(templateData).filter(([key]) => camposPermitidos.includes(key))
            );

            const response = await fetch(`${API_BASE_URL}/template/${templateId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiTemplate)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.message || 'Sin mensaje'}`);
            }

            const data = await response.json();
            //console.log('Plantilla actualizada:', data);
            return convertApiTemplateToAppTemplate(data.template);
        } catch (e) {
            console.error('Error al actualizar plantilla', e);
            throw e;
        }
    },

    async deleteTemplate(templateId) {
        try {
            const response = await fetch(`${API_BASE_URL}/template/${templateId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.message}`);
            return true;
        } catch (e) {
            console.error('Error al eliminar plantilla', e);
        }

    }
};
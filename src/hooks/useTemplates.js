import { useState, useEffect } from 'react';
import { templateService } from '../services/templateService';

export const useTemplates = (user) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTemplates = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      let fetchedTemplates = [];

      if (user.type === 'admin') {
        fetchedTemplates = await templateService.fetchAllTemplates();
      } else if (user.type === 'invitado') {
        fetchedTemplates = await templateService.fetchTemplatesByRole('invitado');
      } else {
        fetchedTemplates = await templateService.fetchTemplatesByAuthor(user.id);
        /*
        const byAuthor = await templateService.fetchTemplatesByAuthor(user.id);
        const byRole = await templateService.fetchTemplatesByRole('invitado');
        const uniqueTemplates = new Map();

        [...byAuthor, ...byRole].forEach(t => uniqueTemplates.set(t._id, t));
        fetchedTemplates = Array.from(uniqueTemplates.values());
        */
      }
      //console.log("Plantillas obtenidas:", fetchedTemplates);
      setTemplates(fetchedTemplates);
    } catch (err) {
      console.error('Error al cargar plantillas:', err);
      setError(err.message);

      // Fallback defensivo
      setTemplates([
        {
          _id: 'temp-1',
          type: 'bienvenida',
          content: 'Hola {{nombre}}, bienvenido al equipo de desarrollo. Estamos emocionados de tenerte en el proyecto {{proyecto}}. ¡Cualquier duda, estamos para ayudarte!',
          labels: ['bienvenida', 'motivación', 'desarrollo de software'],
          author: user.id,
          authorRole: user.type,
          createdAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Create template
  const createTemplate = async (templateData) => {
    try {
      setLoading(true);
      setError(null);

      const newTemplate = await templateService.createTemplate({
        ...templateData,
        author: user.id,
        authorRole: user.type
      });

      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      console.error('Error al crear plantilla:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update template
  const updateTemplate = async (templateId, templateData) => {
    try {
      setLoading(true);
      setError(null);

      const updatedTemplate = await templateService.updateTemplate(templateId, templateData);

      setTemplates(prev =>
        prev.map(t => (t._id === templateId ? updatedTemplate : t))
      );

      return updatedTemplate;
    } catch (err) {
      console.error('Error al actualizar plantilla:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete template
  const deleteTemplate = async (templateId) => {
    try {
      setLoading(true);
      setError(null);

      await templateService.deleteTemplate(templateId);
      setTemplates(prev => prev.filter(t => t._id !== templateId));
    } catch (err) {
      console.error('Error al eliminar plantilla:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh templates
  const refreshTemplates = async () => {
    await fetchTemplates();
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates,
    fetchTemplates
  };
};
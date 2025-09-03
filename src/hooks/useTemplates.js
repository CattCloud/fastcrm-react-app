// Hook para plantillas
import { useState } from 'react';

export const useTemplates = () => {
  const [templates, setTemplates] = useState([
    {
      type: 'bienvenida',
      content: 'Hola {{nombre}}, bienvenido al equipo de desarrollo. Estamos emocionados de tenerte en el proyecto {{proyecto}}. ¡Cualquier duda, estamos para ayudarte!',
      labels: ['bienvenida', 'motivación', 'desarrollo de software'],
      author: { name: 'Invitado', type: 'invitado' },
      createdAt: new Date('2025-08-28')
    },
    {
      type: 'seguimiento',
      content: 'Hola {{nombre}}, ¿cómo va el desarrollo de la funcionalidad {{funcionalidad}}? Si necesitas ayuda o tienes algún bloqueador, no dudes en contactarme.',
      labels: ['seguimiento', 'desarrollo de software', 'apoyo'],
      author: { name: 'Juan Pérez', type: 'usuario' },
      createdAt: new Date('2025-08-27')
    }
  ]);
  
  const [loading, setLoading] = useState(false);

  return { templates, setTemplates, loading, setLoading };
};
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;


const convertApiUserToAppUser = (apiUser) => {
  const autor = apiUser.autor;
  return {
    id: autor._id,
    name: autor.username,
    type: autor.role, // 'admin', 'invitado', 'usuario'
    accessCount: autor.accessCount,
    isActive: autor.isActive,
    createdAt: autor.createdAt,
    updatedAt: autor.updatedAt
  };
};


export const authService = {
  // Obtener usuario invitado (llamada inicial)
  async getGuestUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/author/guest`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.message}`);
      }
      console.log("ruta:", `${API_BASE_URL}/author/guest`);
      const apiUser = await response.json();
      console.log("Usuario invitado obtenido: ", apiUser);
      return convertApiUserToAppUser(apiUser);
    } catch (error) {
      console.error('Error al obtener usuario invitado:', error);
      throw error;
    }
  },

  // Login de usuario
  async loginUser(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/author/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      //console.log("Respuesta de login:", response.status, response);
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message,
          tipo: errorData.tipo || 'general',
        };
      }

      const apiUser = await response.json();
      return {
        success: true,
        user: convertApiUserToAppUser(apiUser),
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error de conexión',
        tipo: 'network',
      };
    }
  },

  // Registrar nuevo usuario
  async registerUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/author`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
          role: 'usuario'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  },

  // Obtener usuario por ID (para validaciones o admin)
  async getUserById(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/author/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const apiUser = await response.json();
      return convertApiUserToAppUser(apiUser);
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw error;
    }
  }
};



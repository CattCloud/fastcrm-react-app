const API_BASE_URL = import.meta.env.VITE_APP_API_URL;


const convertApiUserToAppUser = (apiUser) => {
  return {
    id: apiUser._id,
    name: apiUser.username,
    type: apiUser.role, // 'admin', 'invitado', 'usuario'
    accessCount: apiUser.accessCount,
    isActive: apiUser.isActive,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt
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

      const apiUser = await response.json();
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el login');
      }

      const apiUser = await response.json();
      return convertApiUserToAppUser(apiUser);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
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



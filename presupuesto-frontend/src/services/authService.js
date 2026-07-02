import api from "../services/api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data; // { token, id, nombre, email }
  },

  loginGoogle: async (credential) => {
      const response = await api.post("/auth/google", {
          credential
      });

      return response.data;
  },

  registro: async (nombre, email, password) => {
    const response = await api.post("/auth/registro", { nombre, email, password });
    return response.data;
  },

  solicitarRecuperacion: async (email) => {
      const response = await api.post("/auth/recuperar", { email });
      return response.data;
  },

  resetearPassword: async (email, codigo, nuevaPassword) => {
      const response = await api.post("/auth/reset-password", { email, codigo, nuevaPassword });
      return response.data;
  },
};
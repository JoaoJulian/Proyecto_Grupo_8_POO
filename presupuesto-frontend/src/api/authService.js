import api from "./axios";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data; // { token, id, nombre, email }
  },

  registro: async (nombre, email, password) => {
    const response = await api.post("/auth/registro", { nombre, email, password });
    return response.data;
  },
};
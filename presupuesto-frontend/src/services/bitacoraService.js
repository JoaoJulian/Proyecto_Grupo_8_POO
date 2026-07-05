import api from "./api";

// La bitácora es solo de lectura — nunca se edita ni se elimina
// desde el frontend (así lo define el backend).
export const bitacoraService = {
  // Historial de acciones de un usuario específico
  listarPorUsuario(idUsuario) {
    return api.get(`/bitacora/usuario/${idUsuario}`);
  },

  // Historial de acciones sobre una tabla específica (auditoría general)
  // tablaAfectada: "transaccion" | "presupuesto" | "categoria" | etc.
  listarPorTabla(tablaAfectada) {
    return api.get(`/bitacora/tabla/${tablaAfectada}`);
  },
};

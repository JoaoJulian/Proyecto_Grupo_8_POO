import api from './api';
export const alertaService = {
  listarPorUsuario(idUsuario) {
    return api.get(`/alertas/usuario/${idUsuario}`);
  },
  marcarComoLeida(id) {
    return api.patch(`/alertas/${id}/leida`);
  }
};

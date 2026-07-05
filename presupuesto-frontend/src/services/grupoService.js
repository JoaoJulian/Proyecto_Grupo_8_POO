import api from "./api";

export const grupoService = {
  // Lista los grupos a los que pertenece el usuario
  listarPorUsuario(idUsuario) {
    return api.get(`/grupos/usuario/${idUsuario}`);
  },

  // Crea un nuevo grupo (el usuario autenticado queda como ADMIN)
  crear(data) {
    // data: { nombre, descripcion }
    return api.post("/grupos", data);
  },

  // Invita a un usuario existente por email
  invitar(idGrupo, emailInvitado) {
    return api.post(`/grupos/${idGrupo}/invitar`, { emailInvitado });
  },

  // Lista los miembros activos de un grupo
  listarMiembros(idGrupo) {
    return api.get(`/grupos/${idGrupo}/miembros`);
  },

  // El usuario sale del grupo (borrado lógico de su membresía)
  salir(idGrupo, idUsuario) {
    return api.patch(`/grupos/${idGrupo}/salir/${idUsuario}`);
  },
};

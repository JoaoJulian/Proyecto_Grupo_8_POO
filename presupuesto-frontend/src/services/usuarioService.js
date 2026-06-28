import api from "./api";

export const usuarioService = {

    listar() {
        return api.get("/usuarios");
    },

    obtener(id) {
        return api.get(`/usuarios/${id}`);
    },

    cambiarEstado(id, estado) {
        return api.put(`/usuarios/${id}/estado`, null, {
            params: {
                estado
            }
        });
    }

};
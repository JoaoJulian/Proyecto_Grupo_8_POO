import api from "./api";

export const categoriaService = {

    listar(idUsuario) {
        return api.get(`/categorias/usuario/${idUsuario}`);
    },

    listarPorTipo(idUsuario, tipo) {
        return api.get(`/categorias/usuario/${idUsuario}/tipo/${tipo}`);
    },

    crear(data) {
        return api.post("/categorias", data);
    },

    actualizar(id, data) {
        return api.put(`/categorias/${id}`, data);
    },

    eliminar(id) {
        return api.delete(`/categorias/${id}`);
    }

};
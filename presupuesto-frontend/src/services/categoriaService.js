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

    // El backend hace borrado lógico (desactivar), no DELETE real.
    // Antes: api.delete(`/categorias/${id}`)  -> 404/405, el backend no expone DELETE
    eliminar(id) {
        return api.patch(`/categorias/${id}/desactivar`);
    }

};

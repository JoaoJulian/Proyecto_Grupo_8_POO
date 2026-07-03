import api from "./api";

export const transaccionService = {

    listar(idUsuario) {
        return api.get(`/transacciones/usuario/${idUsuario}`);
    },

    listarPorTipo(idUsuario, tipo) {
        return api.get(`/transacciones/usuario/${idUsuario}/tipo/${tipo}`);
    },

    listarPorRango(idUsuario, fechaInicio, fechaFin) {
        return api.get(`/transacciones/usuario/${idUsuario}/rango`, {
            params: {
                fechaInicio,
                fechaFin
            }
        });
    },

    crear(data) {
        return api.post("/transacciones", data);
    },

    actualizar(id, data) {
        return api.put(`/transacciones/${id}`, data);
    },

    // El backend hace borrado lógico (desactivar), no DELETE real.
    // Antes: api.delete(`/transacciones/${id}`)  -> 404/405, el backend no expone DELETE
    eliminar(id) {
        return api.patch(`/transacciones/${id}/desactivar`);
    }

};

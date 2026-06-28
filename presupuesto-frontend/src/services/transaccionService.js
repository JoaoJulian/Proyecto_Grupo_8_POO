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

    eliminar(id) {
        return api.delete(`/transacciones/${id}`);
    }

};
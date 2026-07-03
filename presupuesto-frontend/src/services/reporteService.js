import api from "./api";

export const reporteService = {

    obtenerMensual(idUsuario, mes, anio) {
        return api.get("/reportes/mensual", {
            params: {
                idUsuario,
                mes,
                anio
            }
        });
    },

    obtenerTransacciones(idUsuario) {
        return api.get(`/transacciones/usuario/${idUsuario}`);
    }

};
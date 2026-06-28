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
    }

};
import api from "./api";

export const presupuestoService = {

    listar(idUsuario) {
        return api.get(`/presupuestos/usuario/${idUsuario}`);
    },

    listarPorMes(idUsuario, mes, anio) {
        return api.get(`/presupuestos/usuario/${idUsuario}/mes/${mes}/anio/${anio}`);
    },

    obtener(id) {
        return api.get(`/presupuestos/${id}`);
    },

    crear(data) {
        return api.post("/presupuestos", data);
    },

    actualizar(id, data) {
        return api.put(`/presupuestos/${id}`, data);
    },

    eliminar(id) {
        return api.delete(`/presupuestos/${id}`);
    },

    verificarAlerta(id) {
        return api.get(`/presupuestos/${id}/verificar-alerta`);
    }

};
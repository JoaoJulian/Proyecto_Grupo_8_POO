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

    // El backend hace borrado lógico (desactivar), no DELETE real.
    // Antes: api.delete(`/presupuestos/${id}`)  -> 404/405, el backend no expone DELETE
    eliminar(id) {
        return api.patch(`/presupuestos/${id}/desactivar`);
    },

    // El backend NO acepta un id de presupuesto: es un endpoint de consulta
    // independiente con query params. Antes: api.get(`/presupuestos/${id}/verificar-alerta`)
    // Backend real: GET /api/presupuestos/alerta?idUsuario=&idCategoria=&mes=&anio=
    verificarAlerta(idUsuario, idCategoria, mes, anio) {
        return api.get("/presupuestos/alerta", {
            params: { idUsuario, idCategoria, mes, anio }
        });
    }

};

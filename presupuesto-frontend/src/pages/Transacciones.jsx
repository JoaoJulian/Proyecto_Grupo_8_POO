// ============================================================
//  Transacciones.jsx
//  Módulo de Transacciones (RF1 / RF2) — Adriano
//  Formulario de nueva transacción + lista de transacciones
// ============================================================
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { transaccionService } from "../services/transaccionService";
import { categoriaService } from "../services/categoriaService";

// ------------------------------------------------------------
// Categorías de respaldo — se usan solo si la API todavía no
// responde (para no bloquear el desarrollo visual del formulario)
// ------------------------------------------------------------
const categoriasMock = [
  { id: 1, nombre: "Alimentación", tipo: "GASTO" },
  { id: 2, nombre: "Transporte", tipo: "GASTO" },
  { id: 3, nombre: "Entretenimiento", tipo: "GASTO" },
  { id: 4, nombre: "Trabajo", tipo: "INGRESO" },
  { id: 5, nombre: "Otros ingresos", tipo: "INGRESO" },
];

const transaccionesMock = [
  { id: 1, tipo: "INGRESO", monto: 1500, fecha: "2026-07-01", categoria: "Trabajo", descripcion: "Salario" },
  { id: 2, tipo: "GASTO", monto: 80, fecha: "2026-07-02", categoria: "Alimentación", descripcion: "Supermercado" },
];

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

// Normaliza una transacción venga como venga del backend
// (fecha vs fechaTransaccion, categoria objeto vs string, etc.)
function normalizarTransaccion(t) {
  return {
    id: t.id,
    tipo: t.tipo,
    monto: t.monto,
    fecha: t.fecha || t.fechaTransaccion || "",
    categoria: typeof t.categoria === "object" ? t.categoria?.nombre : (t.categoria || t.nombreCategoria || "Sin categoría"),
    descripcion: t.descripcion || "",
  };
}

export default function Transacciones() {
  const { usuario } = useAuth();

  const [categorias, setCategorias] = useState(categoriasMock);
  const [transacciones, setTransacciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const [form, setForm] = useState({
    tipo: "GASTO",
    fecha: hoyISO(),
    monto: "",
    idCategoria: "",
    descripcion: "",
  });

  function mostrarNotificacion(tipo, texto) {
    setNotificacion({ tipo, texto });
    setTimeout(() => setNotificacion(null), 3500);
  }

  const cargarDatos = useCallback(async () => {
    if (!usuario?.id) return;
    setCargando(true);
    try {
      const [resCategorias, resTransacciones] = await Promise.all([
        categoriaService.listar(usuario.id),
        transaccionService.listar(usuario.id),
      ]);
      setCategorias(resCategorias.data?.length ? resCategorias.data : categoriasMock);
      setTransacciones((resTransacciones.data || []).map(normalizarTransaccion));
    } catch (e) {
      // El backend puede no estar disponible todavía — seguimos
      // mostrando la pantalla con datos mock en vez de romperla.
      console.error("No se pudieron cargar transacciones/categorías, usando mock:", e);
      setCategorias(categoriasMock);
      setTransacciones(transaccionesMock.map(normalizarTransaccion));
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const categoriasFiltradas = categorias.filter(
    (c) => !c.tipo || c.tipo === form.tipo
  );

  function handleChange(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.monto || Number(form.monto) <= 0) {
      mostrarNotificacion("error", "El monto debe ser mayor a 0.");
      return;
    }
    if (!form.idCategoria) {
      mostrarNotificacion("error", "Selecciona una categoría.");
      return;
    }

    setGuardando(true);
    try {
      await transaccionService.crear({
        idUsuario: usuario.id,
        tipo: form.tipo,
        fecha: form.fecha,
        monto: Number(form.monto),
        idCategoria: Number(form.idCategoria),
        descripcion: form.descripcion,
      });
      mostrarNotificacion("exito", "Transacción registrada correctamente.");
      setForm({ tipo: form.tipo, fecha: hoyISO(), monto: "", idCategoria: "", descripcion: "" });
      cargarDatos();
    } catch (err) {
      mostrarNotificacion("error", err.response?.data?.mensaje || "No se pudo guardar la transacción.");
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar esta transacción?")) return;
    try {
      await transaccionService.eliminar(id);
      mostrarNotificacion("exito", "Transacción eliminada.");
      setTransacciones((prev) => prev.filter((t) => t.id !== id));
    } catch {
      mostrarNotificacion("error", "No se pudo eliminar la transacción.");
    }
  }

  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="title">Transacciones</h1>
        <p className="text-muted">Registra tus ingresos y gastos, y revisa tu historial.</p>
      </div>

      {notificacion && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 14,
            background: notificacion.tipo === "error" ? "var(--bg-danger)" : "var(--accent-bg)",
            color: notificacion.tipo === "error" ? "var(--text-danger)" : "var(--accent)",
            border: `1px solid ${notificacion.tipo === "error" ? "var(--border-danger)" : "var(--border-accent)"}`,
          }}
        >
          {notificacion.texto}
        </div>
      )}

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* ---------------- Formulario ---------------- */}
        <form onSubmit={handleSubmit} className="card" style={{ flex: "1 1 320px", maxWidth: 400 }}>
          <h2 style={{ marginBottom: 16 }}>Nueva transacción</h2>

          {/* Tipo: Ingreso / Gasto */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <span className="form-label">Tipo</span>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                type="button"
                onClick={() => handleChange("tipo", "INGRESO")}
                className="btn btn-sm"
                style={{
                  flex: 1,
                  background: form.tipo === "INGRESO" ? "var(--bg-success, #e9f7ef)" : "var(--surface-1)",
                  color: form.tipo === "INGRESO" ? "var(--text-success, #1e8449)" : "var(--text-muted)",
                  border: form.tipo === "INGRESO" ? "1px solid var(--border-success, #a9dfbf)" : "1px solid var(--border)",
                  fontWeight: form.tipo === "INGRESO" ? 600 : 400,
                }}
              >
                ⬆ Ingreso
              </button>
              <button
                type="button"
                onClick={() => handleChange("tipo", "GASTO")}
                className="btn btn-sm"
                style={{
                  flex: 1,
                  background: form.tipo === "GASTO" ? "var(--bg-danger)" : "var(--surface-1)",
                  color: form.tipo === "GASTO" ? "var(--text-danger)" : "var(--text-muted)",
                  border: form.tipo === "GASTO" ? "1px solid var(--border-danger)" : "1px solid var(--border)",
                  fontWeight: form.tipo === "GASTO" ? 600 : 400,
                }}
              >
                ⬇ Gasto
              </button>
            </div>
          </div>

          {/* Fecha */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label" htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              type="date"
              className="form-input"
              value={form.fecha}
              onChange={(e) => handleChange("fecha", e.target.value)}
              required
            />
          </div>

          {/* Monto */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label" htmlFor="monto">Monto (S/.)</label>
            <input
              id="monto"
              type="number"
              min="0"
              step="0.01"
              className="form-input"
              placeholder="0.00"
              value={form.monto}
              onChange={(e) => handleChange("monto", e.target.value)}
              required
            />
          </div>

          {/* Categoría */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label" htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              className="form-input"
              value={form.idCategoria}
              onChange={(e) => handleChange("idCategoria", e.target.value)}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categoriasFiltradas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label className="form-label" htmlFor="descripcion">Descripción (opcional)</label>
            <textarea
              id="descripcion"
              className="form-input"
              rows={2}
              placeholder="Ej: Supermercado del fin de semana"
              value={form.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={guardando} style={{ width: "100%" }}>
            {guardando ? "Guardando..." : "Guardar transacción"}
          </button>
        </form>

        {/* ---------------- Lista ---------------- */}
        <div className="card" style={{ flex: "2 1 480px" }}>
          <h2 style={{ marginBottom: 16 }}>Historial</h2>

          {cargando ? (
            <p className="text-muted">Cargando transacciones...</p>
          ) : transacciones.length === 0 ? (
            <p className="text-muted">Todavía no tienes transacciones registradas.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {transacciones.map((t) => {
                const esIngreso = t.tipo === "INGRESO";
                return (
                  <div
                    key={t.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: esIngreso ? "var(--bg-success, #e9f7ef)" : "var(--bg-danger)",
                      border: `1px solid ${esIngreso ? "var(--border-success, #a9dfbf)" : "var(--border-danger)"}`,
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontWeight: 500, color: "var(--text-h)" }}>
                        {t.descripcion || t.categoria}
                      </p>
                      <small className="text-muted">
                        {t.fecha} · {t.categoria}
                      </small>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{
                        fontWeight: 700,
                        color: esIngreso ? "var(--text-success, #1e8449)" : "var(--text-danger)",
                      }}>
                        {esIngreso ? "+" : "-"} S/. {Number(t.monto).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleEliminar(t.id)}
                        className="btn btn-sm btn-secondary"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

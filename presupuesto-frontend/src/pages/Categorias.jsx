// ============================================================
//  Categorias.jsx
//  Módulo de Categorías (RF3)
//  CRUD: crear, editar y eliminar categorías personalizadas
// ============================================================
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { categoriaService } from "../services/categoriaService";

// ------------------------------------------------------------
// Categorías de respaldo — se usan solo si la API todavía no
// responde (para no bloquear el desarrollo visual de la pantalla)
// ------------------------------------------------------------
const categoriasMock = [
  { id: 1, nombre: "Alimentación", tipo: "GASTO", descripcion: "" },
  { id: 2, nombre: "Transporte", tipo: "GASTO", descripcion: "" },
  { id: 3, nombre: "Entretenimiento", tipo: "GASTO", descripcion: "" },
  { id: 4, nombre: "Trabajo", tipo: "INGRESO", descripcion: "" },
  { id: 5, nombre: "Otros ingresos", tipo: "INGRESO", descripcion: "" },
];

const formVacio = { nombre: "", tipo: "GASTO", descripcion: "" };

export default function Categorias() {
  const { usuario } = useAuth();

  const [categorias, setCategorias] = useState(categoriasMock);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const [filtro, setFiltro] = useState("TODAS"); // TODAS | INGRESO | GASTO
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [form, setForm] = useState(formVacio);
  const [errorForm, setErrorForm] = useState("");

  function mostrarNotificacion(tipo, texto) {
    setNotificacion({ tipo, texto });
    setTimeout(() => setNotificacion(null), 3500);
  }

  const cargarDatos = useCallback(async () => {
    if (!usuario?.id) return;
    setCargando(true);
    try {
      const res = await categoriaService.listar(usuario.id);
      setCategorias(res.data?.length ? res.data : []);
    } catch (e) {
      console.error("No se pudieron cargar categorías, usando mock:", e);
      setCategorias(categoriasMock);
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const categoriasFiltradas = categorias.filter(
    (c) => filtro === "TODAS" || c.tipo === filtro
  );

  // -------------------------------------------------------
  // Abrir modal (crear o editar)
  // -------------------------------------------------------
  function abrirCrear() {
    setCategoriaEditar(null);
    setForm(formVacio);
    setErrorForm("");
    setModalAbierto(true);
  }

  function abrirEditar(categoria) {
    setCategoriaEditar(categoria);
    setForm({
      nombre: categoria.nombre || "",
      tipo: categoria.tipo || "GASTO",
      descripcion: categoria.descripcion || "",
    });
    setErrorForm("");
    setModalAbierto(true);
  }

  function cerrarModal() {
    setModalAbierto(false);
    setCategoriaEditar(null);
  }

  function handleChange(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErrorForm("");
  }

  // -------------------------------------------------------
  // Guardar (crear o actualizar)
  // -------------------------------------------------------
  async function handleGuardar() {
    if (!form.nombre.trim()) {
      setErrorForm("El nombre de la categoría es obligatorio.");
      return;
    }

    setGuardando(true);
    try {
      if (categoriaEditar) {
        await categoriaService.actualizar(categoriaEditar.id, {
          nombre: form.nombre.trim(),
          tipo: form.tipo,
          descripcion: form.descripcion,
        });
        mostrarNotificacion("exito", "Categoría actualizada.");
      } else {
        await categoriaService.crear({
          nombre: form.nombre.trim(),
          tipo: form.tipo,
          descripcion: form.descripcion,
        });
        mostrarNotificacion("exito", "Categoría creada.");
      }
      await cargarDatos();
      cerrarModal();
    } catch (e) {
      const msg = e.response?.data || "No se pudo guardar la categoría.";
      setErrorForm(typeof msg === "string" ? msg : "No se pudo guardar la categoría.");
    } finally {
      setGuardando(false);
    }
  }

  // -------------------------------------------------------
  // Eliminar (borrado lógico — el backend rechaza si tiene
  // transacciones asociadas)
  // -------------------------------------------------------
  async function handleEliminar(categoria) {
    if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;

    try {
      await categoriaService.eliminar(categoria.id);
      setCategorias((prev) => prev.filter((c) => c.id !== categoria.id));
      mostrarNotificacion("exito", "Categoría eliminada.");
    } catch (e) {
      const msg = e.response?.data;
      mostrarNotificacion(
        "error",
        typeof msg === "string"
          ? msg
          : "No se pudo eliminar. Puede que tenga transacciones asociadas."
      );
    }
  }

  if (cargando) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <p style={{ color: "var(--text-muted)" }}>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>
            Categorías
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
            Crea, edita o elimina las categorías que usas al registrar tus transacciones.
          </p>
        </div>
        <button
          onClick={abrirCrear}
          style={{
            padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500,
            background: "var(--fill-accent)", color: "var(--on-accent)", border: "none",
          }}
        >
          + Nueva categoría
        </button>
      </div>

      {/* Notificación */}
      {notificacion && (
        <div style={{
          padding: "10px 14px", borderRadius: 8, fontSize: 13,
          background: notificacion.tipo === "error" ? "var(--bg-danger)" : "var(--bg-accent)",
          color: notificacion.tipo === "error" ? "var(--text-danger)" : "var(--text-accent)",
          border: notificacion.tipo === "error" ? "0.5px solid var(--border-danger)" : "0.5px solid var(--border-accent)",
        }}>
          {notificacion.texto}
        </div>
      )}

      {/* Filtro por tipo */}
      <div style={{ display: "flex", gap: 8 }}>
        {["TODAS", "INGRESO", "GASTO"].map((opcion) => (
          <button
            key={opcion}
            onClick={() => setFiltro(opcion)}
            style={{
              padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 500,
              border: filtro === opcion ? "1px solid var(--border-accent)" : "0.5px solid var(--border)",
              background: filtro === opcion ? "var(--bg-accent)" : "var(--surface-1)",
              color: filtro === opcion ? "var(--text-accent)" : "var(--text-secondary)",
            }}
          >
            {opcion === "TODAS" ? "Todas" : opcion === "INGRESO" ? "Ingresos" : "Gastos"}
          </button>
        ))}
      </div>

      {/* Lista de categorías */}
      {categoriasFiltradas.length === 0 ? (
        <div style={{
          background: "var(--surface-1)", borderRadius: 12, padding: "2rem",
          textAlign: "center", border: "0.5px solid var(--border)",
        }}>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>
            No tienes categorías {filtro !== "TODAS" ? `de tipo ${filtro.toLowerCase()} ` : ""}todavía.
          </p>
        </div>
      ) : (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14,
        }}>
          {categoriasFiltradas.map((c) => (
            <div
              key={c.id}
              style={{
                background: "var(--surface-2)", border: "0.5px solid var(--border)",
                borderRadius: 12, padding: "1rem 1.15rem",
                display: "flex", flexDirection: "column", gap: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: 15, color: "var(--text-primary)" }}>
                    {c.nombre}
                  </p>
                  {c.descripcion && (
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                      {c.descripcion}
                    </p>
                  )}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 20,
                  background: c.tipo === "INGRESO" ? "var(--bg-success, #e9f7ef)" : "var(--bg-danger)",
                  color: c.tipo === "INGRESO" ? "var(--text-success, #1e8449)" : "var(--text-danger)",
                }}>
                  {c.tipo === "INGRESO" ? "Ingreso" : "Gasto"}
                </span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => abrirEditar(c)}
                  style={{
                    fontSize: 12, padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                    background: "var(--surface-1)", color: "var(--text-secondary)",
                    border: "0.5px solid var(--border)",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(c)}
                  style={{
                    fontSize: 12, padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                    background: "var(--bg-danger)", color: "var(--text-danger)",
                    border: "0.5px solid var(--border-danger)",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear/editar */}
      {modalAbierto && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "var(--surface-2)", borderRadius: 16,
            border: "0.5px solid var(--border)", padding: "1.5rem",
            width: "100%", maxWidth: 420, margin: "1rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: "var(--text-primary)" }}>
                {categoriaEditar ? "Editar categoría" : "Nueva categoría"}
              </h3>
              <button
                onClick={cerrarModal}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 20, color: "var(--text-muted)", lineHeight: 1,
                }}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Nombre */}
              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  placeholder="ej. Alimentación"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              {/* Tipo */}
              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                  Tipo
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["GASTO", "INGRESO"].map((tipoOpcion) => (
                    <button
                      key={tipoOpcion}
                      type="button"
                      onClick={() => handleChange("tipo", tipoOpcion)}
                      style={{
                        flex: 1, padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500,
                        border: form.tipo === tipoOpcion ? "1px solid var(--border-accent)" : "0.5px solid var(--border)",
                        background: form.tipo === tipoOpcion ? "var(--bg-accent)" : "var(--surface-1)",
                        color: form.tipo === tipoOpcion ? "var(--text-accent)" : "var(--text-secondary)",
                      }}
                    >
                      {tipoOpcion === "GASTO" ? "Gasto" : "Ingreso"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                  Descripción (opcional)
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => handleChange("descripcion", e.target.value)}
                  rows={2}
                  placeholder="ej. Comidas, supermercado, delivery..."
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, fontSize: 14, boxSizing: "border-box", resize: "vertical" }}
                />
              </div>

              {errorForm && (
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-danger)", background: "var(--bg-danger)", padding: "8px 12px", borderRadius: 6 }}>
                  {errorForm}
                </p>
              )}

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                <button
                  onClick={cerrarModal}
                  style={{
                    padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 14,
                    background: "var(--surface-1)", color: "var(--text-secondary)",
                    border: "0.5px solid var(--border)",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  disabled={guardando}
                  style={{
                    padding: "8px 18px", borderRadius: 6, cursor: guardando ? "default" : "pointer", fontSize: 14, fontWeight: 500,
                    background: "var(--fill-accent)", color: "var(--on-accent)",
                    border: "none", opacity: guardando ? 0.7 : 1,
                  }}
                >
                  {guardando ? "Guardando..." : categoriaEditar ? "Guardar cambios" : "Crear categoría"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

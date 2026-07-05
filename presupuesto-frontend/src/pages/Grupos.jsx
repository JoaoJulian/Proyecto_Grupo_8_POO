// ============================================================
//  Grupos.jsx
//  Presupuestos compartidos en grupo
//  Crear grupo, invitar miembros por email, ver miembros, salir
// ============================================================
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { grupoService } from "../services/grupoService";

export default function Grupos() {
  const { usuario } = useAuth();

  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [notificacion, setNotificacion] = useState(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [errorForm, setErrorForm] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Grupo actualmente expandido para ver/gestionar miembros
  const [grupoExpandido, setGrupoExpandido] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [cargandoMiembros, setCargandoMiembros] = useState(false);
  const [emailInvitar, setEmailInvitar] = useState("");
  const [invitando, setInvitando] = useState(false);

  function mostrarNotificacion(tipo, texto) {
    setNotificacion({ tipo, texto });
    setTimeout(() => setNotificacion(null), 3500);
  }

  const cargarGrupos = useCallback(async () => {
    if (!usuario?.id) return;
    setCargando(true);
    try {
      const res = await grupoService.listarPorUsuario(usuario.id);
      setGrupos(res.data || []);
    } catch (e) {
      console.error("No se pudieron cargar los grupos:", e);
      mostrarNotificacion("error", "No se pudieron cargar tus grupos.");
      setGrupos([]);
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  useEffect(() => {
    cargarGrupos();
  }, [cargarGrupos]);

  // -------------------------------------------------------
  // Crear grupo
  // -------------------------------------------------------
  function abrirCrear() {
    setForm({ nombre: "", descripcion: "" });
    setErrorForm("");
    setModalAbierto(true);
  }

  async function handleCrear() {
    if (!form.nombre.trim()) {
      setErrorForm("El nombre del grupo es obligatorio.");
      return;
    }
    setGuardando(true);
    try {
      await grupoService.crear({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion,
      });
      mostrarNotificacion("exito", "Grupo creado. Ya eres el administrador.");
      setModalAbierto(false);
      await cargarGrupos();
    } catch (e) {
      const msg = e.response?.data;
      setErrorForm(typeof msg === "string" ? msg : "No se pudo crear el grupo.");
    } finally {
      setGuardando(false);
    }
  }

  // -------------------------------------------------------
  // Ver / ocultar miembros de un grupo
  // -------------------------------------------------------
  async function toggleMiembros(grupo) {
    if (grupoExpandido === grupo.id) {
      setGrupoExpandido(null);
      setMiembros([]);
      return;
    }
    setGrupoExpandido(grupo.id);
    setCargandoMiembros(true);
    try {
      const res = await grupoService.listarMiembros(grupo.id);
      setMiembros(res.data || []);
    } catch (e) {
      console.error("No se pudieron cargar los miembros:", e);
      mostrarNotificacion("error", "No se pudieron cargar los miembros del grupo.");
      setMiembros([]);
    } finally {
      setCargandoMiembros(false);
    }
  }

  // -------------------------------------------------------
  // Invitar por email
  // -------------------------------------------------------
  async function handleInvitar(idGrupo) {
    if (!emailInvitar.trim()) {
      mostrarNotificacion("error", "Escribe el email de la persona a invitar.");
      return;
    }
    setInvitando(true);
    try {
      await grupoService.invitar(idGrupo, emailInvitar.trim());
      mostrarNotificacion("exito", "Invitación enviada — ya forma parte del grupo.");
      setEmailInvitar("");
      const res = await grupoService.listarMiembros(idGrupo);
      setMiembros(res.data || []);
    } catch (e) {
      const msg = e.response?.data;
      mostrarNotificacion(
        "error",
        typeof msg === "string" ? msg : "No se pudo invitar a ese usuario."
      );
    } finally {
      setInvitando(false);
    }
  }

  // -------------------------------------------------------
  // Salir del grupo
  // -------------------------------------------------------
  async function handleSalir(grupo) {
    if (!window.confirm(`¿Salir del grupo "${grupo.nombre}"?`)) return;
    try {
      await grupoService.salir(grupo.id, usuario.id);
      mostrarNotificacion("exito", "Saliste del grupo.");
      setGrupoExpandido(null);
      await cargarGrupos();
    } catch (e) {
      const msg = e.response?.data;
      mostrarNotificacion(
        "error",
        typeof msg === "string" ? msg : "No se pudo salir del grupo."
      );
    }
  }

  if (cargando) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <p style={{ color: "var(--text-muted)" }}>Cargando grupos...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>
            Grupos
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
            Comparte presupuestos con familia o roommates invitándolos por email.
          </p>
        </div>
        <button
          onClick={abrirCrear}
          style={{
            padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500,
            background: "var(--fill-accent)", color: "var(--on-accent)", border: "none",
          }}
        >
          + Nuevo grupo
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

      {/* Lista de grupos */}
      {grupos.length === 0 ? (
        <div style={{
          background: "var(--surface-1)", borderRadius: 12, padding: "2rem",
          textAlign: "center", border: "0.5px solid var(--border)",
        }}>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>
            Todavía no perteneces a ningún grupo. Crea uno para compartir presupuestos.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {grupos.map((g) => (
            <div
              key={g.id}
              style={{
                background: "var(--surface-2)", border: "0.5px solid var(--border)",
                borderRadius: 12, padding: "1rem 1.25rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: 16, color: "var(--text-primary)" }}>
                    {g.nombre}
                  </p>
                  {g.descripcion && (
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                      {g.descripcion}
                    </p>
                  )}
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                    Creado por {g.creador}
                    {g.fechaCreacion && ` · ${new Date(g.fechaCreacion).toLocaleDateString("es-PE")}`}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => toggleMiembros(g)}
                    style={{
                      fontSize: 12, padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                      background: "var(--surface-1)", color: "var(--text-secondary)",
                      border: "0.5px solid var(--border)",
                    }}
                  >
                    {grupoExpandido === g.id ? "Ocultar miembros" : "Ver miembros"}
                  </button>
                  <button
                    onClick={() => handleSalir(g)}
                    style={{
                      fontSize: 12, padding: "5px 12px", borderRadius: 6, cursor: "pointer",
                      background: "var(--bg-danger)", color: "var(--text-danger)",
                      border: "0.5px solid var(--border-danger)",
                    }}
                  >
                    Salir
                  </button>
                </div>
              </div>

              {/* Panel de miembros + invitar */}
              {grupoExpandido === g.id && (
                <div style={{
                  marginTop: 14, paddingTop: 14, borderTop: "0.5px solid var(--border)",
                  display: "flex", flexDirection: "column", gap: 10,
                }}>
                  {cargandoMiembros ? (
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>Cargando miembros...</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {miembros.map((m) => (
                        <div
                          key={m.id}
                          style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            fontSize: 13, padding: "6px 10px", borderRadius: 6, background: "var(--surface-1)",
                          }}
                        >
                          <span style={{ color: "var(--text-primary)" }}>
                            {m.nombreUsuario} <span style={{ color: "var(--text-muted)" }}>· {m.emailUsuario}</span>
                          </span>
                          <span style={{
                            fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20,
                            background: m.rol === "ADMIN" ? "var(--bg-accent)" : "var(--surface-2)",
                            color: m.rol === "ADMIN" ? "var(--text-accent)" : "var(--text-secondary)",
                          }}>
                            {m.rol}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Invitar */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="email"
                      value={emailInvitar}
                      onChange={(e) => setEmailInvitar(e.target.value)}
                      placeholder="email@ejemplo.com"
                      style={{
                        flex: 1, padding: "8px 10px", borderRadius: 6, fontSize: 13, boxSizing: "border-box",
                      }}
                    />
                    <button
                      onClick={() => handleInvitar(g.id)}
                      disabled={invitando}
                      style={{
                        padding: "8px 14px", borderRadius: 6, cursor: invitando ? "default" : "pointer",
                        fontSize: 13, fontWeight: 500,
                        background: "var(--fill-accent)", color: "var(--on-accent)", border: "none",
                        opacity: invitando ? 0.7 : 1,
                      }}
                    >
                      {invitando ? "Invitando..." : "Invitar"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal crear grupo */}
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
                Nuevo grupo
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
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
              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => { setForm((f) => ({ ...f, nombre: e.target.value })); setErrorForm(""); }}
                  placeholder="ej. Gastos de la casa"
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                  Descripción (opcional)
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                  rows={2}
                  placeholder="ej. Presupuesto compartido con mis roommates"
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
                  onClick={() => setModalAbierto(false)}
                  style={{
                    padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 14,
                    background: "var(--surface-1)", color: "var(--text-secondary)",
                    border: "0.5px solid var(--border)",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrear}
                  disabled={guardando}
                  style={{
                    padding: "8px 18px", borderRadius: 6, cursor: guardando ? "default" : "pointer", fontSize: 14, fontWeight: 500,
                    background: "var(--fill-accent)", color: "var(--on-accent)",
                    border: "none", opacity: guardando ? 0.7 : 1,
                  }}
                >
                  {guardando ? "Creando..." : "Crear grupo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

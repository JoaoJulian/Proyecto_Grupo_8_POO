import { useState } from "react";
import { useAuth } from "../context/useAuth";

// ============================================================
// MOCK DATA — reemplaza esto cuando B termine los servicios
// ============================================================
const USUARIO_ID = 1; // simulando usuario autenticado

const mockCategorias = [
  { id: 1, nombre: "Alimentación" },
  { id: 2, nombre: "Transporte" },
  { id: 3, nombre: "Entretenimiento" },
  { id: 4, nombre: "Salud" },
  { id: 5, nombre: "Educación" },
];

const mockPresupuestos = [
  {
    id: 1,
    montoMaximo: 800,
    mes: 6,
    anio: 2026,
    alertaActivada: false,
    usuario: { id: 1 },
    categoria: { id: 1, nombre: "Alimentación" },
    gastadoActual: 620,   // dato calculado localmente en mock
  },
  {
    id: 2,
    montoMaximo: 200,
    mes: 6,
    anio: 2026,
    alertaActivada: true,
    usuario: { id: 1 },
    categoria: { id: 2, nombre: "Transporte" },
    gastadoActual: 245,
  },
  {
    id: 3,
    montoMaximo: 300,
    mes: 6,
    anio: 2026,
    alertaActivada: false,
    usuario: { id: 1 },
    categoria: { id: 3, nombre: "Entretenimiento" },
    gastadoActual: 90,
  },
];

const mockAlertas = [
  {
    id: 1,
    mensaje: "Superaste el presupuesto de Transporte",
    montoGastado: 245,
    montoLimite: 200,
    fechaAlerta: "2026-06-18T14:32:00",
    leida: false,
    presupuesto: { id: 2, categoria: { nombre: "Transporte" } },
    usuario: { id: 1 },
  },
];

// ============================================================
// CUANDO B TERMINE → importa así y borra el mock:
// import { presupuestoService } from "../services/presupuestoService";
// import { categoriaService } from "../services/categoriaService";
// import { alertaService } from "../services/alertaService";
// ============================================================

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

function porcentaje(gastado, maximo) {
  if (!maximo || maximo === 0) return 0;
  return Math.round((gastado / maximo) * 100);
}

function anchoBarra(gastado, maximo) {
  if (!maximo || maximo === 0) return 0;
  return Math.min(Math.round((gastado / maximo) * 100), 100);
}

function colorBarra(pct) {
  if (pct >= 100) return "var(--text-danger)";
  if (pct >= 75) return "#F39C12";
  return "var(--fill-accent)";
}

function colorBadge(pct) {
  if (pct >= 100) return { bg: "var(--bg-danger)", color: "var(--text-danger)" };
  if (pct >= 75) return { bg: "#FEF4DD", color: "#825A0C" };
  return { bg: "var(--accent-bg)", color: "var(--accent)" };
}

function formatMes(mes, anio) {
  return `${MESES[mes - 1]} ${anio}`;
}

// ============================================================
// COMPONENTE: Barra de progreso
// ============================================================
function BarraProgreso({ gastado, maximo }) {
  const pct = porcentaje(gastado, maximo);
  const width = anchoBarra(gastado, maximo);
  const { bg, color } = colorBadge(pct);
  const excedido = maximo > 0 && pct >= 100;
  const tieneLimite = maximo && maximo > 0;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {tieneLimite
            ? `S/. ${gastado.toLocaleString()} de S/. ${maximo.toLocaleString()}`
            : "Sin límite definido"}
        </span>
        <span style={{
          fontSize: 12, fontWeight: 500, padding: "2px 8px",
          borderRadius: 20, background: bg, color,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          {tieneLimite ? `${pct}%` : "0%"}
          {excedido && <span style={{ fontSize: 14 }}>⚠️</span>}
        </span>
      </div>

      {tieneLimite ? (
        <div style={{
          width: "100%", height: 8, borderRadius: 4,
          background: "var(--surface-0)", overflow: "hidden",
        }}>
          <div style={{
            width: `${width}%`, height: "100%",
            borderRadius: 4,
            background: colorBarra(pct),
            transition: "width 0.5s ease",
          }} />
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
          No se puede mostrar la barra sin un límite establecido.
        </p>
      )}
    </div>
  );
}

// ============================================================
// COMPONENTE: Tarjeta de presupuesto
// ============================================================
function TarjetaPresupuesto({ presupuesto, onEditar, onEliminar, onVerificarAlerta }) {
  const pct = porcentaje(presupuesto.gastadoActual, presupuesto.montoMaximo);
  const superado = pct >= 100;

  return (
    <div style={{
      background: "var(--surface-2)",
      border: superado
        ? "1px solid #F09595"
        : "0.5px solid var(--border)",
      borderRadius: 12,
      padding: "1rem 1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>
      {/* Cabecera */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{
            margin: 0, fontWeight: 500, fontSize: 16,
            color: "var(--text-primary)",
          }}>
            {presupuesto.categoria.nombre}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
            {formatMes(presupuesto.mes, presupuesto.anio)}
          </p>
        </div>
        {superado && (
          <span style={{
            fontSize: 11, fontWeight: 500, padding: "3px 8px",
            borderRadius: 20, background: "#FCEBEB", color: "#A32D2D",
          }}>
            ¡Superado!
          </span>
        )}
        {presupuesto.alertaActivada && !superado && (
          <span style={{
            fontSize: 11, fontWeight: 500, padding: "3px 8px",
            borderRadius: 20, background: "#FAEEDA", color: "#854F0B",
          }}>
            Alerta activa
          </span>
        )}
      </div>

      {/* Barra */}
      <BarraProgreso gastado={presupuesto.gastadoActual} maximo={presupuesto.montoMaximo} />

      {/* Monto máximo */}
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
        Límite mensual: <strong>S/. {presupuesto.montoMaximo.toLocaleString()}</strong>
      </p>

      {/* Acciones */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          onClick={() => onVerificarAlerta(presupuesto.id)}
          style={{
            fontSize: 12, padding: "5px 12px", borderRadius: 6, cursor: "pointer",
            background: "var(--bg-accent)", color: "var(--text-accent)",
            border: "0.5px solid var(--border-accent)",
          }}
        >
          Verificar alerta
        </button>
        <button
          onClick={() => onEditar(presupuesto)}
          style={{
            fontSize: 12, padding: "5px 12px", borderRadius: 6, cursor: "pointer",
            background: "var(--surface-1)", color: "var(--text-secondary)",
            border: "0.5px solid var(--border)",
          }}
        >
          Editar
        </button>
        <button
          onClick={() => onEliminar(presupuesto.id)}
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
  );
}

// ============================================================
// COMPONENTE: Modal de formulario
// ============================================================
function ModalPresupuesto({ presupuesto, categorias, onGuardar, onCerrar }) {
  const esEdicion = !!presupuesto;
  const mesActual = new Date().getMonth() + 1;
  const anioActual = new Date().getFullYear();

  const [form, setForm] = useState({
    categoriaId: presupuesto?.categoria?.id || "",
    montoMaximo: presupuesto?.montoMaximo || "",
    mes: presupuesto?.mes || mesActual,
    anio: presupuesto?.anio || anioActual,
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function handleSubmit() {
    if (!form.categoriaId || !form.montoMaximo || form.montoMaximo <= 0) {
      setError("Completa todos los campos con valores válidos.");
      return;
    }
    onGuardar(form, presupuesto?.id);
  }

  // Overlay estilo faux-viewport (no usa position: fixed)
  return (
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
            {esEdicion ? "Editar presupuesto" : "Nuevo presupuesto"}
          </h3>
          <button
            onClick={onCerrar}
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
          {/* Categoría */}
          <div>
            <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
              Categoría
            </label>
            <select
              name="categoriaId"
              value={form.categoriaId}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, fontSize: 14 }}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {/* Monto máximo */}
          <div>
            <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
              Monto máximo (S/.)
            </label>
            <input
              type="number"
              name="montoMaximo"
              value={form.montoMaximo}
              onChange={handleChange}
              min="1"
              placeholder="ej. 500"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>

          {/* Mes y Año */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                Mes
              </label>
              <select
                name="mes"
                value={form.mes}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, fontSize: 14 }}
              >
                {MESES.map((m, i) => (
                  <option key={i + 1} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                Año
              </label>
              <input
                type="number"
                name="anio"
                value={form.anio}
                onChange={handleChange}
                min="2020"
                max="2030"
                style={{ width: "100%", padding: "8px 10px", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
          </div>

          {error && (
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-danger)", background: "var(--bg-danger)", padding: "8px 12px", borderRadius: 6 }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
            <button
              onClick={onCerrar}
              style={{
                padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 14,
                background: "var(--surface-1)", color: "var(--text-secondary)",
                border: "0.5px solid var(--border)",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: 500,
                background: "var(--fill-accent)", color: "var(--on-accent)",
                border: "none",
              }}
            >
              {esEdicion ? "Guardar cambios" : "Crear presupuesto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE: Panel de alertas
// ============================================================
function PanelAlertas({ alertas, onMarcarLeida }) {
  const sinLeer = alertas.filter(a => !a.leida);
  const leidas = alertas.filter(a => a.leida);

  if (alertas.length === 0) {
    return (
      <div style={{
        background: "var(--surface-1)", borderRadius: 12, padding: "2rem",
        textAlign: "center", border: "0.5px solid var(--border)",
      }}>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>
          ✅ Todo en orden — no tienes alertas activas este mes.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sinLeer.length > 0 && (
        <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
          Sin leer ({sinLeer.length})
        </p>
      )}
      {sinLeer.map(alerta => (
        <div key={alerta.id} style={{
          background: "var(--bg-danger)", border: "0.5px solid var(--border-danger)",
          borderRadius: 10, padding: "14px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
        }}>
          <div style={{ flex: 1, display: "flex", gap: 10 }}>
            <span style={{ fontSize: 20, lineHeight: 1, marginTop: 2 }}>⚠️</span>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                {alerta.presupuesto?.categoria?.nombre || "Categoría"}
              </p>
              <p style={{ margin: "4px 0 0", fontWeight: 600, fontSize: 14, color: "var(--text-danger)" }}>
                {alerta.mensaje}
              </p>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                Gastado: S/. {Number(alerta.montoGastado).toLocaleString()} / 
                Límite: S/. {Number(alerta.montoLimite).toLocaleString()}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--text-muted)" }}>
                {new Date(alerta.fechaAlerta).toLocaleDateString("es-PE")}
              </p>
            </div>
          </div>

          <button
            onClick={() => onMarcarLeida(alerta.id)}
            style={{
              fontSize: 12, padding: "6px 12px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap",
              background: "var(--surface-2)", color: "var(--text-secondary)",
              border: "0.5px solid var(--border)",
            }}
          >
            Marcar leída
          </button>
        </div>
      ))}

      {leidas.length > 0 && (
        <>
          <p style={{ margin: "8px 0 4px", fontSize: 13, color: "var(--text-muted)" }}>
            Historial ({leidas.length})
          </p>
          {leidas.map(alerta => (
            <div key={alerta.id} style={{
              background: "var(--surface-1)", border: "0.5px solid var(--border)",
              borderRadius: 10, padding: "12px 14px", opacity: 0.75,
            }}>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                {alerta.presupuesto?.categoria?.nombre || "Categoría"}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                {alerta.mensaje}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--text-muted)" }}>
                {new Date(alerta.fechaAlerta).toLocaleDateString("es-PE")}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL: PresupuestosAlertas
// ============================================================
export default function PresupuestosAlertas() {
  const [presupuestos, setPresupuestos] = useState(mockPresupuestos);
  const [alertas, setAlertas] = useState(mockAlertas);
  const [categorias] = useState(mockCategorias);
  const [tab, setTab] = useState("presupuestos"); // "presupuestos" | "alertas"
  const [modalAbierto, setModalAbierto] = useState(false);
  const [presupuestoEditar, setPresupuestoEditar] = useState(null);
  const [notificacion, setNotificacion] = useState(null); // { tipo: "exito"|"error", texto }
  const { logout } = useAuth();

  function mostrarNotificacion(tipo, texto) {
    setNotificacion({ tipo, texto });
    setTimeout(() => setNotificacion(null), 3500);
  }

  // -------------------------------------------------------
  // Crear / editar presupuesto
  // -------------------------------------------------------
 async function handleGuardar(form, idEditar) {
    const payload = {
      montoMaximo: Number(form.montoMaximo),
      mes: Number(form.mes),
      anio: Number(form.anio),
      usuario: { id: USUARIO_ID },
      categoria: { id: Number(form.categoriaId) },
    };

    if (idEditar) {
      // 1. Encuentra el presupuesto viejo y combínalo con los datos nuevos
      const presupuestoViejo = presupuestos.find(p => p.id === idEditar);
      const presupuestoActualizado = { 
        ...presupuestoViejo, 
        ...payload, 
        categoria: categorias.find(c => c.id === payload.categoria.id) 
      };

      // 2. Actualiza el estado con el objeto que ya calculamos
      setPresupuestos(prev => prev.map(p =>
        p.id === idEditar ? presupuestoActualizado : p
      ));
      
      mostrarNotificacion("exito", "Presupuesto actualizado.");

      // 3. ¡AQUÍ ESTÁ LA MAGIA! Pasa el objeto actualizado directamente
      handleVerificarAlerta(presupuestoActualizado); 

    } else {
      const nuevo = {
        ...payload,
        id: Date.now(),
        alertaActivada: false,
        gastadoActual: 0,
        categoria: categorias.find(c => c.id === payload.categoria.id),
      };
      setPresupuestos(prev => [...prev, nuevo]);
      mostrarNotificacion("exito", "Presupuesto creado.");
      
      // Si quieres verificar al crear (aunque gastado será 0):
      // handleVerificarAlerta(nuevo);
    }
    // --- CON API REAL (descomenta cuando B termine) ---
    // try {
    //   if (idEditar) {
    //     await presupuestoService.actualizar(idEditar, payload);
    //   } else {
    //     await presupuestoService.crear(payload);
    //   }
    //   const actualizados = await presupuestoService.listarPorUsuario(USUARIO_ID);
    //   setPresupuestos(actualizados);
    //   mostrarNotificacion("exito", idEditar ? "Presupuesto actualizado." : "Presupuesto creado.");
    // } catch (e) {
    //   mostrarNotificacion("error", e.response?.data || "Error al guardar.");
    // }

    setModalAbierto(false);
    setPresupuestoEditar(null);
  }

  // -------------------------------------------------------
  // Eliminar presupuesto
  // -------------------------------------------------------
  async function handleEliminar(id) {
    if (!window.confirm("¿Eliminar este presupuesto?")) return;

    // --- CON MOCK ---
    setPresupuestos(prev => prev.filter(p => p.id !== id));
    mostrarNotificacion("exito", "Presupuesto eliminado.");

    // --- CON API REAL ---
    // try {
    //   await presupuestoService.eliminar(id);
    //   setPresupuestos(prev => prev.filter(p => p.id !== id));
    //   mostrarNotificacion("exito", "Presupuesto eliminado.");
    // } catch {
    //   mostrarNotificacion("error", "No se pudo eliminar.");
    // }
  }

  // -------------------------------------------------------
  // Verificar alerta (RF5)
  // -------------------------------------------------------
 // Cambiamos el parámetro para que reciba el objeto (p) en lugar del ID
async function handleVerificarAlerta(p) {
    const gastado = Number(p.gastadoActual);
    const maximo = Number(p.montoMaximo);
    const superado = gastado > maximo;

    if (superado) {
      const nuevaAlerta = {
        id: Date.now(),
        mensaje: `Superaste el presupuesto de ${p.categoria.nombre}`,
        montoGastado: gastado,
        montoLimite: maximo,
        fechaAlerta: new Date().toISOString(),
        leida: false, 
        presupuesto: p,
        usuario: { id: USUARIO_ID },
      };
      setAlertas(prev => [nuevaAlerta, ...prev]);
      mostrarNotificacion("error", `¡Alerta! Superaste el presupuesto de ${p.categoria.nombre}.`);
      setTab("alertas");
    } else {
      // SI TODO ESTÁ BIEN: No creamos ninguna alerta. 
      // Solo limpiamos las alertas rojas anteriores de este presupuesto específico.
      setAlertas(prev => prev.filter(a => a.presupuesto.id !== p.id));

  mostrarNotificacion("exito", "Todo bien, estás dentro del límite.");
    }

    // --- CON API REAL ---
    // try {
    //   const resultado = await presupuestoService.verificarAlerta(presupuestoId);
    //   const alertasActualizadas = await alertaService.listarPorUsuario(USUARIO_ID);
    //   setAlertas(alertasActualizadas);
    //   if (resultado.startsWith("ALERTA")) {
    //     mostrarNotificacion("error", resultado);
    //     setTab("alertas");
    //   } else {
    //     mostrarNotificacion("exito", "Dentro del presupuesto.");
    //   }
    // } catch {
    //   mostrarNotificacion("error", "Error al verificar alerta.");
    // }
  }

  // -------------------------------------------------------
  // Marcar alerta como leída
  // -------------------------------------------------------
  async function handleMarcarLeida(alertaId) {
    // --- CON MOCK ---
    setAlertas(prev => prev.map(a => a.id === alertaId ? { ...a, leida: true } : a));

    // --- CON API REAL ---
    // try {
    //   await alertaService.marcarComoLeida(alertaId);
    //   setAlertas(prev => prev.map(a => a.id === alertaId ? { ...a, leida: true } : a));
    // } catch {
    //   mostrarNotificacion("error", "No se pudo actualizar la alerta.");
    // }
  }

  // -------------------------------------------------------
  // Filtro por mes actual
  // -------------------------------------------------------
  const mesActual = new Date().getMonth() + 1;
  const anioActual = new Date().getFullYear();
  const presupuestosMesActual = presupuestos.filter(
    p => p.mes === mesActual && p.anio === anioActual
  );
  const alertasNoLeidas = alertas.filter(a => !a.leida).length;

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <div style={{ padding: "1.5rem", maxWidth: 800, margin: "0 auto" }}>

      {/* Notificación flotante */}
      {notificacion && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 2000,
          padding: "12px 18px", borderRadius: 10, fontSize: 14, fontWeight: 500,
          background: notificacion.tipo === "exito" ? "#E1F5EE" : "#FCEBEB",
          color: notificacion.tipo === "exito" ? "#0F6E56" : "#A32D2D",
          border: `0.5px solid ${notificacion.tipo === "exito" ? "#9FE1CB" : "#F7C1C1"}`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }}>
          {notificacion.texto}
        </div>
      )}

      {/* Encabezado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: "var(--text-primary)" }}>
            Presupuestos y alertas
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-muted)" }}>
            {formatMes(mesActual, anioActual)} · {presupuestosMesActual.length} presupuestos activos
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14,
            background: "none", color: "var(--text)", border: "1px solid var(--border)",
          }}
        >
          Cerrar sesión
        </button>
        <button
          onClick={() => { setPresupuestoEditar(null); setModalAbierto(true); }}
          style={{
            padding: "9px 18px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500,
            background: "var(--fill-accent)", color: "var(--on-accent)", border: "none",
          }}
        >
          + Nuevo presupuesto
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "0.5px solid var(--border)" }}>
        {[
          { key: "presupuestos", label: "Presupuestos" },
          { key: "alertas", label: `Alertas${alertasNoLeidas > 0 ? ` (${alertasNoLeidas})` : ""}` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "10px 18px", fontSize: 14, cursor: "pointer",
              background: "none", border: "none",
              borderBottom: tab === t.key ? "2px solid var(--fill-accent)" : "2px solid transparent",
              color: tab === t.key ? "var(--text-accent)" : "var(--text-secondary)",
              fontWeight: tab === t.key ? 500 : 400,
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {tab === "presupuestos" && (
        <>
          {presupuestos.length === 0 ? (
            <div style={{
              background: "var(--surface-1)", borderRadius: 12, padding: "3rem",
              textAlign: "center", border: "0.5px solid var(--border)",
            }}>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 15 }}>
                Aún no tienes presupuestos. Crea uno para empezar a controlar tus gastos.
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 14,
            }}>
              {presupuestos.map(p => (
                <TarjetaPresupuesto
                  key={p.id}
                  presupuesto={p}
                  onEditar={(pres) => { setPresupuestoEditar(pres); setModalAbierto(true); }}
                  onEliminar={handleEliminar}
                  onVerificarAlerta={handleVerificarAlerta}
                />
              ))}
            </div>
          )}
        </>
      )}

    {tab === "alertas" && (
  <div>
    {(() => {
      // Separamos las alertas en dos grupos
      const activas = alertas.filter(a => !a.leida);
      const leidas = alertas.filter(a => a.leida);

      return (
        <>
          {/* 1. ALERTAS ACTIVAS O MENSAJE DE ÉXITO */}
          {activas.length > 0 ? (
            // Si hay alertas activas, mostramos el panel. 
            // IMPORTANTE: Le pasamos 'activas' en lugar de 'alertas' para que no duplique.
            <PanelAlertas alertas={activas} onMarcarLeida={handleMarcarLeida} />
          ) : (
            // Si no hay activas, mostramos el mensaje de que todo está en orden
            <div style={{
              background: "var(--surface-1)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "16px", marginBottom: "16px", textAlign: "center"
            }}>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
                ✅ Todo en orden — no tienes alertas activas este mes.
              </p>
            </div>
          )}

          {/* 2. HISTORIAL (Escrito una sola vez) */}
          {leidas.length > 0 && (
            <>
              <p style={{ margin: "16px 0 8px", fontSize: 13, color: "var(--text-muted)" }}>
                Historial ({leidas.length})
              </p>
              
              {leidas.map(alerta => (
                <div key={alerta.id} style={{
                  background: "var(--surface-1)", border: "0.5px solid var(--border)",
                  borderRadius: 10, padding: "12px 14px", opacity: 0.75, marginBottom: "8px"
                }}>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                    {alerta.presupuesto?.categoria?.nombre || "Categoría"}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                    {alerta.mensaje}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--text-muted)" }}>
                    {new Date(alerta.fechaAlerta).toLocaleDateString("es-PE")}
                  </p>
                </div>
              ))}
            </>
          )}
        </>
      );
    })()}
  </div>
)}

      {/* Modal */}
      {modalAbierto && (
        <ModalPresupuesto
          presupuesto={presupuestoEditar}
          categorias={categorias}
          onGuardar={handleGuardar}
          onCerrar={() => { setModalAbierto(false); setPresupuestoEditar(null); }}
        />
      )}
    </div>
  );
}

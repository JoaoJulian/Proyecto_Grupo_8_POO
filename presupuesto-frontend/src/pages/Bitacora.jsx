// ============================================================
//  Bitacora.jsx
//  Historial de actividad del usuario (auditoría) — solo lectura
// ============================================================
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { bitacoraService } from "../services/bitacoraService";

function formatoFecha(fecha) {
  if (!fecha) return "";
  try {
    return new Date(fecha).toLocaleString("es-PE", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return fecha;
  }
}

// Colores por tipo de acción, para que el registro se lea rápido de un vistazo
function estiloAccion(accion) {
  const a = (accion || "").toUpperCase();
  if (a.includes("ELIMINAR") || a.includes("DESACTIVAR") || a.includes("DELETE")) {
    return { bg: "var(--bg-danger)", color: "var(--text-danger)" };
  }
  if (a.includes("CREAR") || a.includes("CREATE")) {
    return { bg: "var(--bg-accent)", color: "var(--text-accent)" };
  }
  if (a.includes("ACTUALIZAR") || a.includes("EDITAR") || a.includes("UPDATE")) {
    return { bg: "var(--surface-1)", color: "var(--text-secondary)" };
  }
  return { bg: "var(--surface-1)", color: "var(--text-secondary)" };
}

export default function Bitacora() {
  const { usuario } = useAuth();

  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!usuario?.id) return;
    setCargando(true);
    setError("");
    try {
      const res = await bitacoraService.listarPorUsuario(usuario.id);
      // Más reciente primero
      const ordenados = [...(res.data || [])].sort(
        (a, b) => new Date(b.fechaAccion) - new Date(a.fechaAccion)
      );
      setRegistros(ordenados);
    } catch (e) {
      console.error("No se pudo cargar la bitácora:", e);
      setError("No se pudo cargar tu historial de actividad.");
      setRegistros([]);
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (cargando) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <p style={{ color: "var(--text-muted)" }}>Cargando historial...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--text-primary)" }}>
          Bitácora de actividad
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
          Historial de acciones realizadas en tu cuenta. Este registro es solo de consulta.
        </p>
      </div>

      {error && (
        <div style={{
          padding: "10px 14px", borderRadius: 8, fontSize: 13,
          background: "var(--bg-danger)", color: "var(--text-danger)",
          border: "0.5px solid var(--border-danger)",
        }}>
          {error}
        </div>
      )}

      {registros.length === 0 ? (
        <div style={{
          background: "var(--surface-1)", borderRadius: 12, padding: "2rem",
          textAlign: "center", border: "0.5px solid var(--border)",
        }}>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>
            Todavía no hay actividad registrada en tu cuenta.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {registros.map((r) => {
            const { bg, color } = estiloAccion(r.accion);
            return (
              <div
                key={r.id}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                  background: "var(--surface-2)", border: "0.5px solid var(--border)",
                  borderRadius: 10, padding: "10px 14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 20,
                    background: bg, color, whiteSpace: "nowrap",
                  }}>
                    {r.accion}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-primary)" }}>
                      {r.detalle || `${r.tablaAfectada || "registro"} #${r.idRegistroAfectado ?? ""}`}
                    </p>
                    {r.tablaAfectada && (
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-muted)" }}>
                        Tabla: {r.tablaAfectada}
                        {r.idRegistroAfectado != null && ` · #${r.idRegistroAfectado}`}
                      </p>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {formatoFecha(r.fechaAccion)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

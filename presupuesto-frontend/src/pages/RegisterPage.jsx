import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmar: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.password || !form.confirmar) {
      setError("Completa todos los campos.");
      return;
    }
    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    try {
      await authService.registro(form.nombre, form.email, form.password);
      // Login automático después del registro
      const datos = await authService.login(form.email, form.password);
      login(datos);
      navigate("/");
    } catch (err) {
      setError("No se pudo crear la cuenta. El email ya podría estar registrado.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div style={{
      minHeight: "100svh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "1rem",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "2rem",
        boxShadow: "var(--shadow)",
      }}>
        {/* Título */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: 28, margin: "0 0 4px", color: "var(--accent)" }}>
            FinTrack
          </h1>
          <p style={{ color: "var(--text)", fontSize: 14 }}>
            Crea tu cuenta para empezar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                fontSize: 14,
                background: "var(--bg)",
                color: "var(--text-h)",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="juan@email.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                fontSize: 14,
                background: "var(--bg)",
                color: "var(--text-h)",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                fontSize: 14,
                background: "var(--bg)",
                color: "var(--text-h)",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmar"
              value={form.confirmar}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                fontSize: 14,
                background: "var(--bg)",
                color: "var(--text-h)",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{
              margin: 0,
              fontSize: 13,
              color: "#A32D2D",
              background: "#FCEBEB",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #F7C1C1",
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              padding: "11px",
              borderRadius: 8,
              border: "none",
              background: "var(--accent)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 500,
              cursor: cargando ? "not-allowed" : "pointer",
              opacity: cargando ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* Link a login */}
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text)", marginTop: "1.5rem" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
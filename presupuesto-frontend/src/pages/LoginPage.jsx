import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Completa todos los campos.");
      return;
    }

    setCargando(true);
    try {
      const datos = await authService.login(form.email, form.password);
      login(datos);
      navigate("/");
    } catch (err) {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
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
        {/* Logo / Título */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: 28, margin: "0 0 4px", color: "var(--accent)" }}>
            FinTrack
          </h1>
          <p style={{ color: "var(--text)", fontSize: 14 }}>
            Inicia sesión para continuar
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
              placeholder="••••••••"
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
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Link a registro */}
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text)", marginTop: "1.5rem" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/registro" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
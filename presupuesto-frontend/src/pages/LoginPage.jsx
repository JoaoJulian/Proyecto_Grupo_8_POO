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
    } catch {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card" style={{ width: "100%", maxWidth: 400 }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="title">FinTrack</h1>
          <p className="text-muted">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-col" style={{ gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="juan@email.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="btn btn-primary"
            style={{ width: "100%", padding: "11px", fontSize: 15 }}
          >
            {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-muted" style={{ textAlign: "center", marginTop: "1.5rem" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-accent" style={{ textDecoration: "none", fontWeight: 500 }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
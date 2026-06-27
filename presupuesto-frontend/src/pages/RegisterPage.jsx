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
      const datos = await authService.login(form.email, form.password);
      login(datos);
      navigate("/");
    } catch {
      setError("No se pudo crear la cuenta. El email ya podría estar registrado.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card" style={{ width: "100%", maxWidth: 400 }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="title">FinTrack</h1>
          <p className="text-muted">Crea tu cuenta para empezar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-col" style={{ gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              className="form-input"
            />
          </div>

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
              placeholder="Mínimo 6 caracteres"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmar"
              value={form.confirmar}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
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
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-muted" style={{ textAlign: "center", marginTop: "1.5rem" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-accent" style={{ textDecoration: "none", fontWeight: 500 }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
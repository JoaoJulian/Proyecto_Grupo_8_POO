import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", codigo: "", nuevaPassword: "", confirmar: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.codigo || !form.nuevaPassword || !form.confirmar) {
      setError("Completa todos los campos.");
      return;
    }
    if (form.nuevaPassword !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (form.nuevaPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    try {
      await authService.resetearPassword(form.email, form.codigo, form.nuevaPassword);
      setExito(true); // ← en vez de navigate("/login")
    } catch (err) {
      setError(err.response?.data || "Código inválido o expirado.");
    } finally {
      setCargando(false);
    }
  }

  if (exito) {
    return (
      <div className="page-center">
        <div className="card" style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
          <h1 className="title">FinTrack</h1>
          <p style={{
            background: "#E1F5EE", color: "#0F6E56",
            padding: "12px", borderRadius: 8, fontSize: 14,
            border: "1px solid #9FE1CB", margin: "1.5rem 0"
          }}>
            ✅ Tu contraseña fue actualizada correctamente.
          </p>
          <Link
            to="/login"
            className="btn btn-primary"
            style={{ display: "block", textDecoration: "none", padding: "11px", fontSize: 15 }}
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-center">
      <div className="card" style={{ width: "100%", maxWidth: 400 }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="title">FinTrack</h1>
          <p className="text-muted">Ingresa tu nuevo código y contraseña</p>
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
            <label className="form-label">Código de recuperación</label>
            <input
              type="text"
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              placeholder="123456"
              className="form-input"
              maxLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nueva contraseña</label>
            <input
              type="password"
              name="nuevaPassword"
              value={form.nuevaPassword}
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
            {cargando ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </form>

        <p className="text-muted" style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/login" className="text-accent" style={{ textDecoration: "none", fontWeight: 500 }}>
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
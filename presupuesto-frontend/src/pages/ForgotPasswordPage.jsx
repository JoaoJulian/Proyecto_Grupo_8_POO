import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    setCargando(true);
    try {
      await authService.solicitarRecuperacion(email);
      setExito(true);
    } catch {
      setError("No existe una cuenta con ese correo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card" style={{ width: "100%", maxWidth: 400 }}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 className="title">FinTrack</h1>
          <p className="text-muted">Recupera tu contraseña</p>
        </div>

        {exito ? (
          <div style={{ textAlign: "center" }}>
            <p style={{
              background: "#E1F5EE", color: "#0F6E56",
              padding: "12px", borderRadius: 8, fontSize: 14,
              border: "1px solid #9FE1CB", marginBottom: "1.5rem"
            }}>
              Te enviamos un código de recuperación a <strong>{email}</strong>.
              Revisa tu bandeja de entrada.
            </p>
            <Link
              to="/reset-password"
              className="btn btn-primary"
              style={{ display: "block", textAlign: "center", textDecoration: "none" }}
            >
              Ingresar código
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-col" style={{ gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="juan@email.com"
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
              {cargando ? "Enviando..." : "Enviar código"}
            </button>
          </form>
        )}

        <p className="text-muted" style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/login" className="text-accent" style={{ textDecoration: "none", fontWeight: 500 }}>
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
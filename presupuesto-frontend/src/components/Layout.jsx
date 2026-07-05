import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', textAlign: 'left' }}>
      <nav style={{ width: '250px', background: 'var(--code-bg)', padding: '20px', borderRight: '1px solid var(--border)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 className="title" style={{ fontSize: '24px', margin: '0 0 20px 0' }}>Sistema de Presupuesto</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/dashboard" style={linkStyle}>Dashboard</Link></li>
            <li><Link to="/transacciones" style={linkStyle}>Transacciones</Link></li>
            <li><Link to="/categorias" style={linkStyle}>Categorías</Link></li>
            <li><Link to="/grupos" style={linkStyle}>Grupos</Link></li>
            <li><Link to="/bitacora" style={linkStyle}>Bitácora</Link></li>
            <li><Link to="/presupuestos" style={linkStyle}>Presupuestos</Link></li>
            <li><Link to="/reportes" style={linkStyle}>Reportes</Link></li>
          </ul>
        </div>

        <button onClick={handleLogout} style={{ ...linkStyle, background: 'none', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
          🚪 Cerrar sesión
        </button>
      </nav>

      <main style={{ flex: 1, padding: '32px', background: 'var(--bg)', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
    </div>
  );
}

// Estilo común para los enlaces compartidos
const linkStyle = {
  textDecoration: 'none',
  color: 'var(--text)',
  fontWeight: '500',
  fontSize: '15px',
  display: 'block',
  padding: '8px 12px',
  borderRadius: '6px',
  transition: 'background 0.2s'
};
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', textAlign: 'left' }}>
      
      {/* Barra lateral - Integrada con los colores de Joao */}
      <nav style={{ 
        width: '250px', 
        background: 'var(--code-bg)', // Cambia automáticamente en modo claro/oscuro
        padding: '20px',
        borderRight: '1px solid var(--border)',
        boxSizing: 'border-box'
      }}>
        <h3 className="title" style={{ fontSize: '24px', margin: '0 0 20px 0' }}>FinTrack</h3>
        
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
          </li>
          <li>
            <Link to="/transacciones" style={linkStyle}>Transacciones</Link>
          </li>
          <li>
            <Link to="/presupuestos" style={linkStyle}>Presupuestos</Link>
          </li>
          <li>
            <Link to="/reportes" style={linkStyle}>Reportes</Link>
          </li>
        </ul>
      </nav>

      {/* Contenido principal de las páginas */}
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
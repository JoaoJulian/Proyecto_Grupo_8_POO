import React, { useState, useEffect } from 'react';
import { reporteService } from '../services/reporteService'; 

export default function Dashboard() {
  const [reporte, setReporte] = useState({ ingresosMes: 0, gastosMes: 0, balance: 0 });
  const [transacciones, setTransacciones] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatosDashboard() {
      try {
        const idUsuario = 1; // Ajustado al nombre de variable de tu grupo
        const mesActual = new Date().getMonth() + 1;
        const anioActual = new Date().getFullYear();

        // 1. Llamada al backend para el resumen mensual (.data porque el servicio retorna la promesa de Axios)
        const responseReporte = await reporteService.obtenerMensual(idUsuario, mesActual, anioActual);
        const dataReporte = responseReporte?.data;

        if (dataReporte) {
          const totalIngresos = dataReporte.total_ingresos !== undefined ? dataReporte.total_ingresos : (dataReporte.totalIngresos || 0);
          const totalGastos = dataReporte.total_gastos !== undefined ? dataReporte.total_gastos : (dataReporte.totalGastos || 0);
          const saldoNeto = dataReporte.saldo_neto !== undefined ? dataReporte.saldo_neto : (dataReporte.saldoNeto || 0);
          setReporte({ ingresosMes: totalIngresos, gastosMes: totalGastos, balance: saldoNeto });
        }

        // 2. Llamada para las transacciones (.data para obtener el array real)
        const responseTransacciones = await reporteService.obtenerTransacciones(idUsuario);
        const dataTransacciones = responseTransacciones?.data;

        if (dataTransacciones) {
          setTransacciones(dataTransacciones.slice(0, 3));
        }

      } catch (error) {
        console.error("Usando datos mock de respaldo (servidor apagado o ruta incompleta):", error);
        setReporte({ ingresosMes: 3500, gastosMes: 2100, balance: 1400 });
        setTransacciones([
          { id: 1, descripcion: 'Sueldo mensual', tipo: 'INGRESO', monto: 3500, fechaTransaccion: '2026-07-01', categoria: { nombre: 'Trabajo' } },
          { id: 2, descripcion: 'Supermercado', tipo: 'GASTO', monto: 150, fechaTransaccion: '2026-07-02', categoria: { nombre: 'Alimentos' } }
        ]);
      } finally {
        setLoading(false);
      }
    }

    cargarDatosDashboard();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}><p className="text-muted">Cargando dashboard...</p></div>;
  }

  return (
    <div className="dashboard-container" style={{ textAlign: 'left', padding: '20px', width: '100%' }}>
      <h1 className="title" style={{ marginBottom: '4px' }}>Dashboard Principal</h1>
      <p className="text-muted" style={{ marginBottom: '24px' }}>Bienvenido al sistema de gestión de presupuesto.</p>

      {/* Tarjetas de Resumen */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        <div className="card-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '32px', background: 'var(--accent-bg)', padding: '10px', borderRadius: '12px' }}>💰</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>Ingresos del Mes</h2>
            <p style={{ fontSize: '26px', fontWeight: 'bold', color: 'var(--accent)', margin: 0 }}>${reporte.ingresosMes}</p>
          </div>
        </div>

        <div className="card-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '32px', background: 'rgba(163, 45, 45, 0.1)', padding: '10px', borderRadius: '12px' }}>📉</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>Gastos del Mes</h2>
            <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#A32D2D', margin: 0 }}>${reporte.gastosMes}</p>
          </div>
        </div>

        <div className="card-sm" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '32px', background: 'var(--code-bg)', padding: '10px', borderRadius: '12px' }}>⚖️</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>Balance Neto</h2>
            <p style={{ fontSize: '26px', fontWeight: 'bold', color: 'var(--text-h)', margin: 0 }}>${reporte.balance}</p>
          </div>
        </div>
      </div>

      {/* Sección Actividad Reciente */}
      <div className="card" style={{ padding: '20px', textAlign: 'left' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-h)' }}>Actividad Reciente</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transacciones.length === 0 ? (
            <p className="text-muted">No hay transacciones registradas.</p>
          ) : (
            transacciones.map((t) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontWeight: '500', color: 'var(--text-h)', margin: 0 }}>{t.descripcion}</p>
                  <small className="text-muted">
                    {t.fechaTransaccion} • <span style={{ color: 'var(--accent)' }}>{t.categoria?.nombre || 'General'}</span>
                  </small>
                </div>
                <span style={{ fontWeight: 'bold', color: t.tipo === 'INGRESO' ? 'var(--accent)' : '#A32D2D' }}>
                  {t.tipo === 'INGRESO' ? `+ $${t.monto}` : `- $${t.monto}`}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
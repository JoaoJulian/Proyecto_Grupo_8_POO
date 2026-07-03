import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { reporteService } from "../services/reporteService";
import { useAuth } from "../context/useAuth";

const COLORS = ["#27AE60", "#E74C3C", "#2E86C1", "#F39C12"];

function Reportes() {
  const { usuario } = useAuth();

  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());

  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState(null);

  const handleBuscar = async () => {
    if (!usuario) return;

    try {
      setLoading(true);

      const res = await reporteService.obtenerMensual(
        usuario.id,
        mes,
        anio
      );

      setDatos(res.data);
    } catch (error) {
      console.error("Error al obtener reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      handleBuscar();
    }
  }, [usuario]);

  const ingresos = datos?.total_ingresos ?? 0;
  const gastos = datos?.total_gastos ?? 0;
  const balance = datos?.saldo_neto ?? 0;

  const datosCategorias =
    datos?.gastos_por_categoria?.map((c) => ({
      name: c.nombre,
      value: c.totalGastado,
    })) ?? [];

  const balanceData = [
    {
      name: "Ingresos",
      monto: ingresos,
    },
    {
      name: "Gastos",
      monto: gastos,
    },
  ];

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        backgroundColor: "var(--surface-1)",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "25px" }}>
        Módulo de Reportes y Gráficos
      </h1>

      {/* FILTROS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <input
          type="number"
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
          placeholder="Mes"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(Number(e.target.value))}
          placeholder="Año"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleBuscar}
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "var(--fill-accent)",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* TARJETAS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        <div style={cardStyle}>
          <h3>Ingresos</h3>
          <h2>S/ {ingresos}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Gastos</h3>
          <h2>S/ {gastos}</h2>
        </div>

        <div style={cardStyle}>
          <h3>Balance</h3>
          <h2>S/ {balance}</h2>
        </div>
      </div>
      {/* GRAFICOS */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        {/* PIE CHART */}
        <div style={chartContainer}>
          <h2>Gastos por Categoría</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosCategorias}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {datosCategorias.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div style={chartContainer}>
          <h2>Ingresos vs Gastos</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={balanceData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />
              <YAxis />

              <Tooltip />

              <Bar
                dataKey="monto"
                fill="#2E86C1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLA */}
      <div
        style={{
          marginTop: "40px",
          backgroundColor: "var(--surface-0)",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h2>Detalle de Transacciones</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "var(--fill-accent)",
                color: "white",
              }}
            >
              <th style={thStyle}>Categoría</th>
              <th style={thStyle}>Monto</th>
              <th style={thStyle}>Tipo</th>
            </tr>
          </thead>

          <tbody>
            {datos?.gastos_por_categoria?.length ? (
              datos.gastos_por_categoria.map((item, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{item.nombre}</td>
                  <td style={tdStyle}>S/ {item.totalGastado}</td>
                  <td style={tdStyle}>GASTO</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  No hay datos para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "var(--surface-0)",
  padding: "20px",
  borderRadius: "12px",
  width: "220px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const chartContainer = {
  backgroundColor: "var(--surface-0)",
  padding: "20px",
  borderRadius: "12px",
  width: "500px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const thStyle = {
  padding: "12px",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

export default Reportes;

import { useState } from "react";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Reportes() {

  const [mes, setMes] = useState(6);
  const [anio, setAnio] = useState(2025);

  // DATOS DE PRUEBA
  const datosCategorias = [
    { name: "Alimentación", value: 530 },
    { name: "Transporte", value: 45 },
    { name: "Entretenimiento", value: 120 },
    { name: "Alquiler", value: 1200 },
  ];

  const balanceData = [
    { name: "Ingresos", monto: 4300 },
    { name: "Gastos", monto: 1895 },
  ];

  const ingresos = 4300;
  const gastos = 1895;
  const balance = ingresos - gastos;

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        backgroundColor: "#f4f6f9",
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
          onChange={(e) => setMes(e.target.value)}
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
          onChange={(e) => setAnio(e.target.value)}
          placeholder="Año"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          style={{
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#1976d2",
            color: "white",
            cursor: "pointer",
          }}
        >
          Buscar
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
                fill="#1976d2"
              />

            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* TABLA */}
      <div
        style={{
          marginTop: "40px",
          backgroundColor: "white",
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
            <tr style={{ backgroundColor: "#1976d2", color: "white" }}>
              <th style={thStyle}>Categoría</th>
              <th style={thStyle}>Monto</th>
              <th style={thStyle}>Tipo</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td style={tdStyle}>Alimentación</td>
              <td style={tdStyle}>S/ 530</td>
              <td style={tdStyle}>GASTO</td>
            </tr>

            <tr>
              <td style={tdStyle}>Transporte</td>
              <td style={tdStyle}>S/ 45</td>
              <td style={tdStyle}>GASTO</td>
            </tr>

            <tr>
              <td style={tdStyle}>Sueldo</td>
              <td style={tdStyle}>S/ 3500</td>
              <td style={tdStyle}>INGRESO</td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
}

const cardStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "12px",
  width: "220px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const chartContainer = {
  backgroundColor: "white",
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


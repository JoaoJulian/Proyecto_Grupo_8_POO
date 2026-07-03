import { useState } from "react";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  function login(datos) {
    localStorage.setItem("token", datos.token);
    localStorage.setItem("usuario", JSON.stringify({
      id: datos.id,
      nombre: datos.nombre,
      email: datos.email,
    }));
    setUsuario({ id: datos.id, nombre: datos.nombre, email: datos.email });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

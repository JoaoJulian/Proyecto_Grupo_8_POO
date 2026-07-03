// playwright.config.js
// Ir en la raíz de presupuesto-frontend (mismo nivel que package.json)
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  // Tiempo máximo por prueba
  timeout: 30 * 1000,

  // Reintenta una vez si una prueba falla (útil si el backend está lento)
  retries: 1,

  // Reporte en HTML, se abre con `npx playwright show-report`
  reporter: "html",

  use: {
    // Ajustar si el frontend corre en otro puerto (revisa la consola de `npm run dev`)
    baseURL: "http://localhost:5173",

    // Guarda captura y video solo si la prueba falla, para debug rápido
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // NOTA: no se configura webServer aquí porque el frontend depende del
  // backend (Spring Boot) para funcionar. Levanta ambos manualmente antes
  // de correr `npx playwright test`:
  //   Terminal 1: cd presupuesto-backend/presupuesto-personal && mvn spring-boot:run
  //   Terminal 2: cd presupuesto-frontend && npm run dev
  //   Terminal 3: cd presupuesto-frontend && npx playwright test
});

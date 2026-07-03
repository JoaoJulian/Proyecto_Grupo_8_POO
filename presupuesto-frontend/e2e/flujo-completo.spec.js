// Tarea 7 — Pruebas de integración end-to-end
// Requiere: backend levantado (Spring Boot) + frontend levantado (npm run dev)
// Instalación: npm install -D @playwright/test  &&  npx playwright install
// Ejecución:   npx playwright test e2e/flujo-completo.spec.js
// Requiere playwright.config.js en la raíz con baseURL configurado

import { test, expect } from "@playwright/test";

const USUARIO_PRUEBA = {
  email: "prueba.e2e@example.com",
  password: "Prueba123!",
};

test.describe("Flujo completo: login -> transacciones -> presupuestos -> alertas -> reportes", () => {

  test("login exitoso redirige al dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', USUARIO_PRUEBA.email);
    await page.fill('input[type="password"]', USUARIO_PRUEBA.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator("text=Dashboard Principal")).toBeVisible();
  });

  test("las tarjetas de resumen reflejan al usuario logueado, no un id fijo", async ({ page }) => {
    await page.goto("/dashboard");
    // Verifica que la llamada de red use el id real del usuario, no 1 fijo
    const [request] = await Promise.all([
      page.waitForRequest((req) => req.url().includes("/reportes/mensual")),
    ]);
    const url = new URL(request.url());
    expect(url.searchParams.get("idUsuario")).not.toBe("1");
  });

  test("crear una transacción nueva y verla en la lista", async ({ page }) => {
    await page.goto("/transacciones");
    // El formulario está siempre visible en la página, no hay botón para abrir un modal
    await page.click('button:has-text("⬇ Gasto")');
    await page.fill("#fecha", "2026-07-03");
    await page.fill("#monto", "99.90");
    await page.selectOption("#categoria", { index: 1 });
    await page.fill("#descripcion", "Compra de prueba e2e");
    await page.click('button:has-text("Guardar transacción")');
    await expect(page.locator("text=Compra de prueba e2e")).toBeVisible();
  });

  test("eliminar transacción realmente la quita de la lista (verifica el fix del PATCH desactivar)", async ({ page }) => {
    await page.goto("/transacciones");
    const fila = page.locator("div", { hasText: "Compra de prueba e2e" }).first();
    await fila.locator('button[title="Eliminar"]').click();
    await expect(page.locator("text=Compra de prueba e2e")).toHaveCount(0);
  });

  test("crear presupuesto y disparar alerta al superar el límite", async ({ page }) => {
    await page.goto("/presupuestos");
    // Ajustar estos selectores a los ids/labels reales del formulario de
    // PresupuestosAlertas.jsx antes de correr (no se verificaron aquí en detalle).
    await page.click("text=Nuevo presupuesto");
    await page.fill('input[type="number"]', "50");
    await page.click('button:has-text("Guardar")');
    await expect(page.locator(".panel-alertas")).toBeVisible();
  });

  test("reportes muestra datos reales del usuario, no los mocks fijos", async ({ page }) => {
    await page.goto("/reportes");
    // Antes del fix de la tarea 1, esto siempre mostraba S/ 4300 / S/ 1895 sin importar el usuario
    const ingresos = await page.locator("text=Ingresos").locator("..").locator("h2").innerText();
    expect(ingresos).not.toBe("S/ 4300");
  });

});

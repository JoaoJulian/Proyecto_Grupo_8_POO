package com.presupuesto.presupuesto_personal.controller;

import com.presupuesto.presupuesto_personal.dto.TransaccionRequestDTO;
import com.presupuesto.presupuesto_personal.dto.TransaccionResponseDTO;
import com.presupuesto.presupuesto_personal.model.Transaccion;
import com.presupuesto.presupuesto_personal.model.TipoTransaccion;
import com.presupuesto.presupuesto_personal.service.TransaccionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {

    @Autowired
    private TransaccionService transaccionService;

    // GET /api/transacciones/usuario/{idUsuario}
    // Lista todas las transacciones de un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<TransaccionResponseDTO>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(transaccionService.listarPorUsuario(idUsuario));
    }

    // GET /api/transacciones/usuario/{idUsuario}/tipo/{tipo}
    // Lista transacciones filtradas por tipo (INGRESO o GASTO)
    @GetMapping("/usuario/{idUsuario}/tipo/{tipo}")
    public ResponseEntity<List<TransaccionResponseDTO>> listarPorTipo(
            @PathVariable Long idUsuario,
            @PathVariable TipoTransaccion tipo) {
        return ResponseEntity.ok(transaccionService.listarPorUsuarioYTipo(idUsuario, tipo));
    }

    // GET /api/transacciones/usuario/{idUsuario}/rango?fechaInicio=2025-01-01&fechaFin=2025-01-31
    // Lista transacciones en un rango de fechas (necesario para RF4 - reportes)
    @GetMapping("/usuario/{idUsuario}/rango")
    public ResponseEntity<List<TransaccionResponseDTO>> listarPorRango(
            @PathVariable Long idUsuario,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        return ResponseEntity.ok(transaccionService.listarPorRangoFechas(idUsuario, fechaInicio, fechaFin));
    }

    // POST /api/transacciones
    // Registra una nueva transacción (ingreso o gasto)
    @PostMapping
    public ResponseEntity<TransaccionResponseDTO> crear(@RequestBody TransaccionRequestDTO transaccion) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        TransaccionResponseDTO nueva = transaccionService.guardar(transaccion, email);
        return ResponseEntity.status(201).body(nueva);
    }

    // PUT /api/transacciones/{id}
    // Actualiza una transacción existente
    @PutMapping("/{id}")
    public ResponseEntity<TransaccionResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody TransaccionRequestDTO transaccion) {
        TransaccionResponseDTO actualizada = transaccionService.actualizar(id, transaccion);
        return ResponseEntity.ok(actualizada);
    }

    // DELETE /api/transacciones/{id}
    // Elimina una transacción
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        transaccionService.eliminar(id);
        return ResponseEntity.ok("Transacción eliminada correctamente");
    }
}
package com.presupuesto.presupuesto_personal.controller;

import com.presupuesto.presupuesto_personal.model.Presupuesto;
import com.presupuesto.presupuesto_personal.service.PresupuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presupuestos")
public class PresupuestoController {

    @Autowired
    private PresupuestoService presupuestoService;

    // GET /api/presupuestos/usuario/{usuarioId}
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Presupuesto>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(presupuestoService.listarPorUsuario(usuarioId));
    }

    // GET /api/presupuestos/usuario/{usuarioId}/mes/{mes}/anio/{anio}
    @GetMapping("/usuario/{usuarioId}/mes/{mes}/anio/{anio}")
    public ResponseEntity<List<Presupuesto>> listarPorUsuarioMesAnio(
            @PathVariable Long usuarioId,
            @PathVariable Integer mes,
            @PathVariable Integer anio) {
        return ResponseEntity.ok(presupuestoService.listarPorUsuarioMesAnio(usuarioId, mes, anio));
    }

    // GET /api/presupuestos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Presupuesto> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(presupuestoService.buscarPorId(id));
    }

    // POST /api/presupuestos
    @PostMapping
    public ResponseEntity<Presupuesto> crear(@RequestBody Presupuesto presupuesto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(presupuestoService.crear(presupuesto));
    }

    // PUT /api/presupuestos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Presupuesto> actualizar(
            @PathVariable Long id,
            @RequestBody Presupuesto presupuesto) {
        return ResponseEntity.ok(presupuestoService.actualizar(id, presupuesto));
    }

    // DELETE /api/presupuestos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        presupuestoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

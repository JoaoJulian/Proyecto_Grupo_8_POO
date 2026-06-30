package com.presupuesto.presupuesto_personal.controller;

import com.presupuesto.presupuesto_personal.dto.PresupuestoRequestDTO;
import com.presupuesto.presupuesto_personal.dto.PresupuestoResponseDTO;
import com.presupuesto.presupuesto_personal.service.PresupuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/presupuestos")
public class PresupuestoController {

    @Autowired
    private PresupuestoService presupuestoService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PresupuestoResponseDTO>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(presupuestoService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/mes/{mes}/anio/{anio}")
    public ResponseEntity<List<PresupuestoResponseDTO>> listarPorUsuarioMesAnio(
            @PathVariable Long usuarioId,
            @PathVariable Integer mes,
            @PathVariable Integer anio) {
        return ResponseEntity.ok(presupuestoService.listarPorUsuarioMesAnio(usuarioId, mes, anio));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PresupuestoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(presupuestoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PresupuestoResponseDTO> crear(@RequestBody PresupuestoRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        PresupuestoResponseDTO creado = presupuestoService.crear(dto, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PresupuestoResponseDTO> actualizar(
            @PathVariable Long id,
            @RequestBody PresupuestoRequestDTO dto) {
        return ResponseEntity.ok(presupuestoService.actualizar(id, dto));
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        presupuestoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/presupuestos/alerta?idUsuario=1&idCategoria=2&mes=6&anio=2025
    @GetMapping("/alerta")
    public ResponseEntity<String> verificarAlerta(
            @RequestParam Long idUsuario,
            @RequestParam Long idCategoria,
            @RequestParam Integer mes,
            @RequestParam Integer anio) {
        String resultado = presupuestoService.verificarAlerta(idUsuario, idCategoria, mes, anio);
        return ResponseEntity.ok(resultado);
    }
}
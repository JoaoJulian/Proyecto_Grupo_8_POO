package com.presupuesto.presupuesto_personal.controller;

import com.presupuesto.presupuesto_personal.dto.AlertaResponseDTO;
import com.presupuesto.presupuesto_personal.service.AlertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alertas")
public class AlertaController {

    @Autowired
    private AlertaService alertaService;

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<AlertaResponseDTO>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(alertaService.listarPorUsuario(idUsuario));
    }

    @PutMapping("/{id}/leida")
    public ResponseEntity<AlertaResponseDTO> marcarComoLeida(@PathVariable Long id) {
        return ResponseEntity.ok(alertaService.marcarComoLeida(id));
    }
}
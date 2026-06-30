package com.presupuesto.presupuesto_personal.controller;

import com.presupuesto.presupuesto_personal.dto.BitacoraResponseDTO;
import com.presupuesto.presupuesto_personal.model.Bitacora;
import com.presupuesto.presupuesto_personal.service.BitacoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bitacora")
public class BitacoraController {

    @Autowired
    private BitacoraService bitacoraService;

    // Consultar historial por usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<BitacoraResponseDTO>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(bitacoraService.listarPorUsuario(idUsuario));
    }

    // Consultar historial por tabla (útil para auditoría general)
    @GetMapping("/tabla/{tablaAfectada}")
    public ResponseEntity<List<BitacoraResponseDTO>> listarPorTabla(@PathVariable String tablaAfectada) {
        return ResponseEntity.ok(bitacoraService.listarPorTabla(tablaAfectada));
    }

    // La bitácora NUNCA se edita ni se elimina, solo se consulta (GET)
}

package com.presupuesto.presupuesto_personal.controller;


import com.presupuesto.presupuesto_personal.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    // GET /api/reportes/mensual?idUsuario=1&mes=6&anio=2025
    @GetMapping("/mensual")
    public ResponseEntity<Map<String, Object>> reporteMensual(
            @RequestParam Long idUsuario,
            @RequestParam Integer mes,
            @RequestParam Integer anio) {
        Map<String, Object> reporte = reporteService.reporteMensual(idUsuario, mes, anio);
        return ResponseEntity.ok(reporte);
    }
}

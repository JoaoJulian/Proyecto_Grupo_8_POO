package com.presupuesto.presupuesto_personal.controller;
import com.presupuesto.presupuesto_personal.model.Alerta;
import com.presupuesto.presupuesto_personal.service.AlertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController
@RequestMapping("/api/alertas")
public class AlertaController {
    @Autowired
    private AlertaService alertaService;
    @GetMapping("/usuario/{idUsuario}")
    public List<Alerta> listarPorUsuario(@PathVariable Long idUsuario) {
        return alertaService.listarPorUsuario(idUsuario);
    }
    @PutMapping("/{id}/leida")
    public Alerta marcarComoLeida(@PathVariable Long id) {
        return alertaService.marcarComoLeida(id);
    }
}
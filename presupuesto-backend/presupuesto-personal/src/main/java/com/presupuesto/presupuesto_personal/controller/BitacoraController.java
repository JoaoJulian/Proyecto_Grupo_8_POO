package com.presupuesto.presupuesto_personal.controller;

import com.presupuesto.presupuesto_personal.model.Bitacora;
import com.presupuesto.presupuesto_personal.service.BitacoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bitacora")
public class BitacoraController {

    @Autowired
    private BitacoraService bitacoraService;

    // Consultar historial por usuario
    @GetMapping("/usuario/{idUsuario}")
    public List<Bitacora> listarPorUsuario(@PathVariable Long idUsuario) {
        return bitacoraService.listarPorUsuario(idUsuario);
    }

    // Consultar historial por tabla (útil para auditoría general)
    @GetMapping("/tabla/{tablaAfectada}")
    public List<Bitacora> listarPorTabla(@PathVariable String tablaAfectada) {
        return bitacoraService.listarPorTabla(tablaAfectada);
    }

    // La bitácora NUNCA se edita ni se elimina, solo se consulta (GET)
}

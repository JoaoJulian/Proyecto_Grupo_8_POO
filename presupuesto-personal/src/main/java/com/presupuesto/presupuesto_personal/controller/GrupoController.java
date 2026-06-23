package com.presupuesto.presupuesto_personal.controller;

import com.presupuesto.presupuesto_personal.dto.*;
import com.presupuesto.presupuesto_personal.service.GrupoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grupos")
public class GrupoController {

    @Autowired
    private GrupoService grupoService;

    @PostMapping
    public ResponseEntity<GrupoResponseDTO> crear(@RequestBody GrupoRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        GrupoResponseDTO creado = grupoService.crear(dto, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PostMapping("/{idGrupo}/invitar")
    public ResponseEntity<GrupoMiembroResponseDTO> invitar(
            @PathVariable Long idGrupo,
            @RequestBody InvitacionRequestDTO dto) {
        GrupoMiembroResponseDTO miembro = grupoService.invitar(idGrupo, dto.getEmailInvitado());
        return ResponseEntity.status(HttpStatus.CREATED).body(miembro);
    }

    @GetMapping("/{idGrupo}/miembros")
    public ResponseEntity<List<GrupoMiembroResponseDTO>> listarMiembros(@PathVariable Long idGrupo) {
        return ResponseEntity.ok(grupoService.listarMiembros(idGrupo));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<GrupoResponseDTO>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(grupoService.listarPorUsuario(idUsuario));
    }

    @PatchMapping("/{idGrupo}/salir/{idUsuario}")
    public ResponseEntity<Void> salir(@PathVariable Long idGrupo, @PathVariable Long idUsuario) {
        grupoService.salirDelGrupo(idGrupo, idUsuario);
        return ResponseEntity.noContent().build();
    }
}

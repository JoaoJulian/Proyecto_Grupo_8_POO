package com.presupuesto.presupuesto_personal.controller;

import com.presupuesto.presupuesto_personal.dto.UsuarioResponseDTO;
import com.presupuesto.presupuesto_personal.model.Usuario;
import com.presupuesto.presupuesto_personal.model.Usuario.EstadoUsuario;
import com.presupuesto.presupuesto_personal.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    public UsuarioResponseDTO obtener(@PathVariable Long id) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return UsuarioResponseDTO.builder()
                .id(u.getId())
                .nombre(u.getNombre())
                .email(u.getEmail())
                .estado(u.getEstado())
                .build();
    }

    // Endpoint PUT /api/usuarios/{id}/estado para activar o desactivar usuario
    @PutMapping("/{id}/estado")
    public UsuarioResponseDTO cambiarEstado(@PathVariable Long id,
                                            @RequestParam EstadoUsuario estado) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        u.setEstado(estado);
        usuarioRepository.save(u);

        return UsuarioResponseDTO.builder()
                .id(u.getId())
                .nombre(u.getNombre())
                .email(u.getEmail())
                .estado(u.getEstado())
                .build();
    }
}

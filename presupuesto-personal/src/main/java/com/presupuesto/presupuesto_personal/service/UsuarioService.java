package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.dto.UsuarioRequestDTO;
import com.presupuesto.presupuesto_personal.dto.UsuarioResponseDTO;
import com.presupuesto.presupuesto_personal.dto.UsuarioUpdateDTO;
import com.presupuesto.presupuesto_personal.model.Usuario;
import com.presupuesto.presupuesto_personal.repository.UsuarioRepository;
import com.presupuesto.presupuesto_personal.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Buscar por ID
    public UsuarioResponseDTO buscarPorId(Long id) {

        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        return toResponseDTO(u);
    }

    // Buscar por email
    public UsuarioResponseDTO buscarPorEmail(String email) {

        Usuario u = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));

        return toResponseDTO(u);
    }

    // Actualizar perfil
    public UsuarioResponseDTO actualizar(Long id, UsuarioUpdateDTO dto) {

        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        existente.setNombre(dto.getNombre());
        existente.setEmail(dto.getEmail());

        Usuario guardado = usuarioRepository.save(existente);

        return toResponseDTO(guardado);
    }

    //Listar usuarios
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    //Cambiar estado
    public UsuarioResponseDTO cambiarEstado(Long id, Usuario.EstadoUsuario estado) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setEstado(estado);
        Usuario guardado = usuarioRepository.save(usuario);
        return toResponseDTO(guardado);
    }

    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        return UsuarioResponseDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .estado(usuario.getEstado())
                .build();
    }
}

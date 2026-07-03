package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.dto.UsuarioResponseDTO;
import com.presupuesto.presupuesto_personal.dto.UsuarioUpdateDTO;
import com.presupuesto.presupuesto_personal.model.Usuario;
import com.presupuesto.presupuesto_personal.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;

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

    // Solicitar recuperación de contraseña
    public void solicitarRecuperacion(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No existe una cuenta con ese email."));

        // Generar código de 6 dígitos
        String codigo = String.format("%06d", new java.util.Random().nextInt(999999));

        usuario.setResetToken(codigo);
        usuario.setResetTokenExpiracion(LocalDateTime.now().plusMinutes(15));
        usuarioRepository.save(usuario);

        emailService.enviarCodigoRecuperacion(email, codigo);
    }

    // Verificar código y cambiar contraseña
    public void resetearPassword(String email, String codigo, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No existe una cuenta con ese email."));

        if (usuario.getResetToken() == null || !usuario.getResetToken().equals(codigo)) {
            throw new RuntimeException("Código de recuperación inválido.");
        }

        if (usuario.getResetTokenExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El código ha expirado. Solicita uno nuevo.");
        }

        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuario.setResetToken(null);
        usuario.setResetTokenExpiracion(null);
        usuarioRepository.save(usuario);
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

package com.presupuesto.presupuesto_personal.controller;

import com.presupuesto.presupuesto_personal.dto.LoginRequestDTO;
import com.presupuesto.presupuesto_personal.dto.LoginResponseDTO;
import com.presupuesto.presupuesto_personal.dto.UsuarioRequestDTO;
import com.presupuesto.presupuesto_personal.dto.UsuarioResponseDTO;
import com.presupuesto.presupuesto_personal.model.Usuario;
import com.presupuesto.presupuesto_personal.repository.UsuarioRepository;
import com.presupuesto.presupuesto_personal.security.JwtUtils;
import com.presupuesto.presupuesto_personal.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registro")
    public UsuarioResponseDTO registro(@RequestBody UsuarioRequestDTO request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Ya existe un usuario con ese email");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        Usuario guardado = usuarioRepository.save(usuario);

        return UsuarioResponseDTO.builder()
                .id(guardado.getId())
                .nombre(guardado.getNombre())
                .email(guardado.getEmail())
                .estado(guardado.getEstado())
                .build();
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO request) {

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String token = jwtUtils.generarToken(usuario.getEmail());

        return new LoginResponseDTO(
                token,
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail()
        );
    }

    @PostMapping("/recuperar")
    public ResponseEntity<String> solicitarRecuperacion(@RequestBody Map<String, String> body) {
        try {
            usuarioService.solicitarRecuperacion(body.get("email"));
            return ResponseEntity.ok("Código de recuperación enviado al correo.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetearPassword(@RequestBody Map<String, String> body) {
        try {
            usuarioService.resetearPassword(
                    body.get("email"),
                    body.get("codigo"),
                    body.get("nuevaPassword")
            );
            return ResponseEntity.ok("Contraseña actualizada correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

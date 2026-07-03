package com.presupuesto.presupuesto_personal.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.presupuesto.presupuesto_personal.dto.LoginResponseDTO;
import com.presupuesto.presupuesto_personal.model.Usuario;
import com.presupuesto.presupuesto_personal.repository.UsuarioRepository;
import com.presupuesto.presupuesto_personal.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;

@Service
public class GoogleAuthService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${google.client-id}")
    private String googleClientId;

    public LoginResponseDTO loginConGoogle(String credential) {

        try {

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);

            if (idToken == null) {
                throw new RuntimeException("Token de Google inválido.");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            Boolean emailVerificado = (Boolean) payload.get("email_verified");

            if (emailVerificado == null || !emailVerificado) {
                throw new RuntimeException("El correo de Google no está verificado.");
            }

            String email = payload.getEmail();
            String nombre = (String) payload.get("name");

            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseGet(() -> {

                        Usuario nuevo = Usuario.builder()
                                .nombre(nombre)
                                .email(email)
                                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                                .estado(Usuario.EstadoUsuario.ACTIVO)
                                .build();

                        return usuarioRepository.save(nuevo);
                    });

            String jwt = jwtUtils.generarToken(usuario.getEmail());

            return new LoginResponseDTO(
                    jwt,
                    usuario.getId(),
                    usuario.getNombre(),
                    usuario.getEmail()
            );

        } catch (Exception e) {
            throw new RuntimeException("Error al validar el token de Google", e);
        }
    }

}

package com.presupuesto.presupuesto_personal.dto;

import com.presupuesto.presupuesto_personal.model.Usuario.EstadoUsuario;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponseDTO {

    private Long id;
    private String nombre;
    private String email;
    private EstadoUsuario estado;
    // password NO se incluye por seguridad
}

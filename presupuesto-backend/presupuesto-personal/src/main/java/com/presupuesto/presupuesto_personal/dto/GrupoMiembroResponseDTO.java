package com.presupuesto.presupuesto_personal.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrupoMiembroResponseDTO {
    private Long id;
    private Long idGrupo;
    private Long idUsuario;
    private String nombreUsuario;
    private String emailUsuario;
    private String rol;
    private LocalDateTime fechaUnion;
}

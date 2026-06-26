package com.presupuesto.presupuesto_personal.dto;

import java.time.LocalDateTime;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BitacoraResponseDTO {
    private Long id;
    private Long idUsuario;
    private String accion;
    private String tablaAfectada;
    private Long idRegistroAfectado;
    private String detalle;
    private LocalDateTime fechaAccion;
}

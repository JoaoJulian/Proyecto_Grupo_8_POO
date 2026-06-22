package com.presupuesto.presupuesto_personal.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertaResponseDTO {
    private Long id;
    private Long idUsuario;
    private Long idPresupuesto;
    private String mensaje;
    private BigDecimal montoGastado;
    private BigDecimal montoLimite;
    private LocalDateTime fechaAlerta;
    private Boolean leida;
}

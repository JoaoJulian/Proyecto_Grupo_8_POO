package com.presupuesto.presupuesto_personal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresupuestoResponseDTO {
    private Long id;
    private BigDecimal montoMaximo;
    private Integer mes;
    private Integer anio;
    private boolean alertaActivada;
    private Long idUsuario;
    private CategoriaResponseDTO categoria;
}

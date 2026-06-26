package com.presupuesto.presupuesto_personal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrupoResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String creador;
    private LocalDateTime fechaCreacion;
}

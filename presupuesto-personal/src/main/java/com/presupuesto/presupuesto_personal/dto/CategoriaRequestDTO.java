package com.presupuesto.presupuesto_personal.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaRequestDTO {
    private String nombre;
    private String tipo;
    private String descripcion;
}

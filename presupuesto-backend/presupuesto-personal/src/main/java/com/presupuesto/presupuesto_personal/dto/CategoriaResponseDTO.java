package com.presupuesto.presupuesto_personal.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaResponseDTO {
    private Long id;
    private String nombre;
    private String tipo;
    private String descripcion;
    private Long idUsuario;
}

package com.presupuesto.presupuesto_personal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrupoRequestDTO {
    private String nombre;
    private String descripcion;
}

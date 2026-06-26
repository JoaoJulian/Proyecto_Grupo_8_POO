package com.presupuesto.presupuesto_personal.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequestDTO {

    private String nombre;
    private String email;
    private String password;
}

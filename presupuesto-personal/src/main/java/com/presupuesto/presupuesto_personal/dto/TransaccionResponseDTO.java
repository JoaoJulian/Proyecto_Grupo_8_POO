package com.presupuesto.presupuesto_personal.dto;

import com.presupuesto.presupuesto_personal.model.TipoTransaccion;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransaccionResponseDTO {
    private Long id;
    private BigDecimal monto;
    private TipoTransaccion tipo;
    private String descripcion;
    private LocalDate fechaTransaccion;
    private Long idUsuario;
    private CategoriaResponseDTO categoria;
}

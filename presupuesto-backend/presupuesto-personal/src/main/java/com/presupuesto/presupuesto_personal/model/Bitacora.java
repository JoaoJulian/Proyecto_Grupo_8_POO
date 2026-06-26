package com.presupuesto.presupuesto_personal.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bitacora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, length = 20)
    private String accion; // CREAR, EDITAR, ELIMINAR

    @Column(name = "tabla_afectada", nullable = false, length = 50)
    private String tablaAfectada;

    @Column(name = "id_registro_afectado", nullable = false)
    private Long idRegistroAfectado;

    @Column(columnDefinition = "TEXT")
    private String detalle;

    @Column(name = "fecha_accion", nullable = false, updatable = false)
    private LocalDateTime fechaAccion;

    @PrePersist
    protected void onCreate() {
        this.fechaAccion = LocalDateTime.now();
    }
}

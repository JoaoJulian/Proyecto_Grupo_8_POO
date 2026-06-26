package com.presupuesto.presupuesto_personal.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity @Table(name = "alerta")
@Data @NoArgsConstructor
@AllArgsConstructor
@Builder public class Alerta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;
    @ManyToOne
    @JoinColumn(name = "id_presupuesto", nullable = false)
    private Presupuesto presupuesto;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensaje;
    @Column(name = "monto_gastado", nullable = false)
    private BigDecimal montoGastado;
    @Column(name = "monto_limite", nullable = false)
    private BigDecimal montoLimite;
    @Column(name = "fecha_alerta", nullable = false, updatable = false)
    private LocalDateTime fechaAlerta;
    @Column(nullable = false)
    private Boolean leida = false;

    @PrePersist
    protected void onCreate() {
        this.fechaAlerta = LocalDateTime.now();
    }
}
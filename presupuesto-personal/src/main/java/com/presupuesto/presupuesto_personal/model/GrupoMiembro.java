package com.presupuesto.presupuesto_personal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "grupo_miembro")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrupoMiembro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_grupo", nullable = false)
    private Grupo grupo;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RolGrupo rol;

    @Column(name = "fecha_union", nullable = false, updatable = false)
    private LocalDateTime fechaUnion;

    @Column(nullable = false)
    private Boolean activo = true;

    @PrePersist
    protected void onCreate() {
        this.fechaUnion = LocalDateTime.now();
    }

    public enum RolGrupo {
        ADMIN, MIEMBRO
    }
}

package com.presupuesto.presupuesto_personal.repository;

import com.presupuesto.presupuesto_personal.model.GrupoMiembro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GrupoMiembroRepository extends JpaRepository<GrupoMiembro, Long> {
    List<GrupoMiembro> findByGrupoIdAndActivoTrue(Long idGrupo);
    List<GrupoMiembro> findByUsuarioIdAndActivoTrue(Long idUsuario);
    Optional<GrupoMiembro> findByGrupoIdAndUsuarioIdAndActivoTrue(Long idGrupo, Long idUsuario);
    boolean existsByGrupoIdAndUsuarioIdAndActivoTrue(Long idGrupo, Long idUsuario);
}

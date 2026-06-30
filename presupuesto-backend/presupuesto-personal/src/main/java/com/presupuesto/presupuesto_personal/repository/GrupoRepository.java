package com.presupuesto.presupuesto_personal.repository;

import com.presupuesto.presupuesto_personal.model.Grupo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GrupoRepository extends JpaRepository<Grupo, Long> {
    List<Grupo> findByCreadorIdAndActivoTrue(Long idCreador);

    Optional<Grupo> findByIdAndActivoTrue(Long idGrupo);
}

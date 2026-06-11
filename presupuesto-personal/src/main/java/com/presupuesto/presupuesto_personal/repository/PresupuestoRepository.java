package com.presupuesto.presupuesto_personal.repository;

import com.presupuesto.presupuesto_personal.model.Presupuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PresupuestoRepository  extends JpaRepository<Presupuesto, Long> {
    // Listar todos los presupuestos de un usuario
    List<Presupuesto> findByUsuarioId(Long usuarioId);

    // Buscar presupuesto específico por usuario + categoría + mes + año (para RF5)
    Optional<Presupuesto> findByUsuarioIdAndCategoriaIdAndMesAndAnio(
            Long usuarioId, Long categoriaId, Integer mes, Integer anio);

    // Listar presupuestos de un usuario en un mes y año específico
    List<Presupuesto> findByUsuarioIdAndMesAndAnio(
            Long usuarioId, Integer mes, Integer anio);
}

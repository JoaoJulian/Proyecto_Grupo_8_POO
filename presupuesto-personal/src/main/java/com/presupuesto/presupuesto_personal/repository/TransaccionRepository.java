package com.presupuesto.presupuesto_personal.repository;

import com.presupuesto.presupuesto_personal.model.Transaccion;
import com.presupuesto.presupuesto_personal.model.TipoTransaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {

    // Buscar todas las transacciones de un usuario
    List<Transaccion> findByUsuarioId(Long idUsuario);

    // Buscar por usuario y tipo (ahora usa el enum)
    List<Transaccion> findByUsuarioIdAndTipo(Long idUsuario, TipoTransaccion tipo);

    // Buscar por usuario en un rango de fechas
    List<Transaccion> findByUsuarioIdAndFechaTransaccionBetween(
            Long idUsuario,
            LocalDate fechaInicio,
            LocalDate fechaFin
    );
}
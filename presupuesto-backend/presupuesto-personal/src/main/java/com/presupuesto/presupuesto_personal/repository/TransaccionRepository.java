package com.presupuesto.presupuesto_personal.repository;

import com.presupuesto.presupuesto_personal.model.Transaccion;
import com.presupuesto.presupuesto_personal.model.TipoTransaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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

    //Paso 4: suma de gastos por usuario, categoría y rango de fechas
    @Query("SELECT COALESCE(SUM(t.monto), 0) FROM Transaccion t " +
            "WHERE t.usuario.id = :idUsuario " +
            "AND t.categoria.id = :idCategoria " +
            "AND t.tipo = :tipo " +
            "AND t.fechaTransaccion BETWEEN :fechaInicio AND :fechaFin")
    BigDecimal sumarMontoPorUsuarioCategoriaYFechas(
            @Param("idUsuario") Long idUsuario,
            @Param("idCategoria") Long idCategoria,
            @Param("tipo") TipoTransaccion tipo,
            @Param("fechaInicio") LocalDate fechaInicio,
            @Param("fechaFin") LocalDate fechaFin
    );
}
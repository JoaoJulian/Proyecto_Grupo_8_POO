package com.presupuesto.presupuesto_personal.repository;

import com.presupuesto.presupuesto_personal.model.Bitacora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BitacoraRepository extends JpaRepository<Bitacora, Long> {

    List<Bitacora> findByUsuarioId(Long idUsuario);

    List<Bitacora> findByTablaAfectada(String tablaAfectada);
}

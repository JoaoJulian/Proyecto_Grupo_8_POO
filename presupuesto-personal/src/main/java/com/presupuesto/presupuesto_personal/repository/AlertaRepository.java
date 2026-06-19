package com.presupuesto.presupuesto_personal.repository;
import com.presupuesto.presupuesto_personal.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByUsuarioId(Long idUsuario);
    List<Alerta> findByUsuarioIdAndLeidaFalse(Long idUsuario);
}
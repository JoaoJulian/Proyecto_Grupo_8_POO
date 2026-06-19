package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.model.Transaccion;
import com.presupuesto.presupuesto_personal.model.TipoTransaccion;
import com.presupuesto.presupuesto_personal.repository.TransaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransaccionService {

    @Autowired
    private TransaccionRepository transaccionRepository;

    // Paso 6: inyectar BitacoraService
    @Autowired
    private BitacoraService bitacoraService;

    public Transaccion guardar(Transaccion transaccion) {
        Transaccion guardada = transaccionRepository.save(transaccion);

        // Registrar en bitácora después de guardar
        bitacoraService.registrar(
                guardada.getUsuario(),
                "CREAR",
                "transaccion",
                guardada.getId(),
                "Se registró una transacción de " + guardada.getTipo() + " por S/." + guardada.getMonto()
        );

        return guardada;
    }

    public Transaccion actualizar(Long id, Transaccion datos) {
        Transaccion existente = transaccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

        existente.setTipo(datos.getTipo());
        existente.setMonto(datos.getMonto());
        // agregar otros campos según el modelo real

        Transaccion actualizada = transaccionRepository.save(existente);

        bitacoraService.registrar(
                actualizada.getUsuario(),
                "EDITAR",
                "transaccion",
                actualizada.getId(),
                "Se editó una transacción de " + actualizada.getTipo() + " por S/." + actualizada.getMonto()
        );

        return actualizada;
    }

    public void eliminar(Long id) {
        Transaccion existente = transaccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

        bitacoraService.registrar(
                existente.getUsuario(),
                "ELIMINAR",
                "transaccion",
                existente.getId(),
                "Se eliminó una transacción de " + existente.getTipo() + " por S/." + existente.getMonto()
        );

        transaccionRepository.deleteById(id);
    }

    public List<Transaccion> listarTodas() {
        return transaccionRepository.findAll();
    }

    // Requerido por TransaccionController: lista todas las transacciones de un usuario
    public List<Transaccion> listarPorUsuario(Long idUsuario) {
        return transaccionRepository.findByUsuarioId(idUsuario);
    }

    // Requerido por TransaccionController: filtra por usuario y tipo (INGRESO/GASTO)
    public List<Transaccion> listarPorUsuarioYTipo(Long idUsuario, TipoTransaccion tipo) {
        return transaccionRepository.findByUsuarioIdAndTipo(idUsuario, tipo);
    }

    // Requerido por TransaccionController: filtra por usuario y rango de fechas (RF4 - reportes)
    public List<Transaccion> listarPorRangoFechas(Long idUsuario, LocalDate fechaInicio, LocalDate fechaFin) {
        return transaccionRepository.findByUsuarioIdAndFechaTransaccionBetween(idUsuario, fechaInicio, fechaFin);
    }
}
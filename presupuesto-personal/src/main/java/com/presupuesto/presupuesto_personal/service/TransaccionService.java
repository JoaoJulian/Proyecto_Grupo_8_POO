package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.exception.RecursoNoEncontradoException;
import com.presupuesto.presupuesto_personal.model.Transaccion;
import com.presupuesto.presupuesto_personal.model.TipoTransaccion;
import com.presupuesto.presupuesto_personal.repository.TransaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransaccionService {

    @Autowired
    private TransaccionRepository transaccionRepository;

    // Listar todas las transacciones de un usuario
    public List<Transaccion> listarPorUsuario(Long idUsuario) {
        return transaccionRepository.findByUsuarioId(idUsuario);
    }

    // Listar transacciones de un usuario filtradas por tipo
    public List<Transaccion> listarPorUsuarioYTipo(Long idUsuario, TipoTransaccion tipo) {
        return transaccionRepository.findByUsuarioIdAndTipo(idUsuario, tipo);
    }

    // Listar transacciones en un rango de fechas (RF4 - reportes)
    public List<Transaccion> listarPorRangoFechas(
            Long idUsuario,
            LocalDate fechaInicio,
            LocalDate fechaFin) {
        return transaccionRepository.findByUsuarioIdAndFechaTransaccionBetween(
                idUsuario, fechaInicio, fechaFin
        );
    }

    // Registrar ingreso o gasto (con validación de monto)
    public Transaccion guardar(Transaccion transaccion) {
        if (transaccion.getMonto() == null
                || transaccion.getMonto().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("El monto debe ser mayor a cero");
        }
        return transaccionRepository.save(transaccion);
    }

    // Editar una transacción existente (con validación de monto)
    public Transaccion actualizar(Long id, Transaccion datosNuevos) {
        Transaccion transaccion = transaccionRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "Transacción no encontrada con id: " + id
                ));

        if (datosNuevos.getMonto() == null
                || datosNuevos.getMonto().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("El monto debe ser mayor a cero");
        }

        transaccion.setMonto(datosNuevos.getMonto());
        transaccion.setTipo(datosNuevos.getTipo());
        transaccion.setDescripcion(datosNuevos.getDescripcion());
        transaccion.setFechaTransaccion(datosNuevos.getFechaTransaccion());
        transaccion.setCategoria(datosNuevos.getCategoria());

        return transaccionRepository.save(transaccion);
    }

    // Eliminar una transacción
    public void eliminar(Long id) {
        if (!transaccionRepository.existsById(id)) {
            throw new RecursoNoEncontradoException(
                    "Transacción no encontrada con id: " + id
            );
        }
        transaccionRepository.deleteById(id);
    }
}
package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.model.Presupuesto;
import com.presupuesto.presupuesto_personal.model.TipoTransaccion;
import com.presupuesto.presupuesto_personal.repository.PresupuestoRepository;
import com.presupuesto.presupuesto_personal.repository.TransaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
public class PresupuestoService {

    @Autowired
    private  PresupuestoRepository presupuestoRepository;

    // Paso 4: inyectar TransaccionRepository (para sumar gastos) y AlertaService (para crear alertas)
    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private AlertaService alertaService;

    // Crear presupuesto
    public Presupuesto crear(Presupuesto presupuesto) {
        // Verifica que no exista ya uno para la misma combinación
        Optional<Presupuesto> existente = presupuestoRepository
                .findByUsuarioIdAndCategoriaIdAndMesAndAnio(
                        presupuesto.getUsuario().getId(),
                        presupuesto.getCategoria().getId(),
                        presupuesto.getMes(),
                        presupuesto.getAnio()
                );
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un presupuesto para esa categoría en ese mes y año.");
        }
        return presupuestoRepository.save(presupuesto);
    }

    // Listar por usuario
    public List<Presupuesto> listarPorUsuario(Long usuarioId){
        return presupuestoRepository.findByUsuarioId(usuarioId);
    }

    // Listar por usuario, mes y año
    public List<Presupuesto> listarPorUsuarioMesAnio(Long usuarioId, Integer mes, Integer anio) {
        return presupuestoRepository.findByUsuarioIdAndMesAndAnio(usuarioId, mes, anio);
    }

    // Buscar por ID
    public Presupuesto buscarPorId(Long id) {
        return presupuestoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado con id: " + id));
    }

    // Actualizar
    public Presupuesto actualizar(Long id, Presupuesto datos) {
        Presupuesto existente = buscarPorId(id);
        existente.setMontoMaximo(datos.getMontoMaximo());
        existente.setMes(datos.getMes());
        existente.setAnio(datos.getAnio());
        existente.setCategoria(datos.getCategoria());
        return presupuestoRepository.save(existente);
    }

    // Eliminar
    public void eliminar(Long id) {
        buscarPorId(id); // verifica que existe antes de eliminar
        presupuestoRepository.deleteById(id);
    }

    // Paso 4 (RF5): verificar si el gasto acumulado del mes supera el presupuesto y generar alerta
    public String verificarAlerta(Long presupuestoId) {
        Presupuesto presupuesto = buscarPorId(presupuestoId);

        // Rango de fechas correspondiente al mes/año del presupuesto
        YearMonth yearMonth = YearMonth.of(presupuesto.getAnio(), presupuesto.getMes());
        LocalDate fechaInicio = yearMonth.atDay(1);
        LocalDate fechaFin = yearMonth.atEndOfMonth();

        BigDecimal totalGastado = transaccionRepository.sumarMontoPorUsuarioCategoriaYFechas(
                presupuesto.getUsuario().getId(),
                presupuesto.getCategoria().getId(),
                TipoTransaccion.GASTO,
                fechaInicio,
                fechaFin
        );

        if (totalGastado.compareTo(presupuesto.getMontoMaximo()) > 0) {
            presupuesto.setAlertaActivada(true);
            presupuestoRepository.save(presupuesto);
            alertaService.crear(presupuesto.getUsuario(), presupuesto, totalGastado);
            return "ALERTA: Superaste tu presupuesto. Gastado: S/." + totalGastado
                    + " / Máximo: S/." + presupuesto.getMontoMaximo();
        }

        return "OK: Dentro del presupuesto. Gastado: S/." + totalGastado
                + " / Máximo: S/." + presupuesto.getMontoMaximo();
    }
}
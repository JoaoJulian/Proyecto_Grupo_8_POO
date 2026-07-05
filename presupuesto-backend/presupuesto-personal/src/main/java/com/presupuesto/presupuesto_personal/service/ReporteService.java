package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.model.Transaccion;
import com.presupuesto.presupuesto_personal.model.TipoTransaccion;
import com.presupuesto.presupuesto_personal.repository.TransaccionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReporteService {

    @Autowired
    private TransaccionRepository transaccionRepository;

    // Reporte Mensual
    public Map<String, Object> reporteMensual(Long idUsuario, Integer mes, Integer anio) {

        LocalDate inicio = LocalDate.of(anio, mes, 1);
        LocalDate fin = inicio.withDayOfMonth(inicio.lengthOfMonth());

        List<Transaccion> transacciones = transaccionRepository
                .findByUsuarioIdAndFechaTransaccionBetweenAndActivoTrue(idUsuario, inicio, fin);

        BigDecimal totalIngresos = transacciones.stream()
                .filter(t -> t.getTipo() == TipoTransaccion.INGRESO)
                .map(Transaccion::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalGastos = transacciones.stream()
                .filter(t -> t.getTipo() == TipoTransaccion.GASTO)
                .map(Transaccion::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal saldoNeto = totalIngresos.subtract(totalGastos);

        Map<String, BigDecimal> gastosPorCategoriaMap = new HashMap<>();
        transacciones.stream()
                .filter(t -> t.getTipo() == TipoTransaccion.GASTO && t.getCategoria() != null)
                .forEach(t -> {
                    String nombreCategoria = t.getCategoria().getNombre();
                    gastosPorCategoriaMap.merge(nombreCategoria, t.getMonto(), BigDecimal::add);
                });
// El frontend espera un ARRAY de objetos {nombre, totalGastado}, no un objeto {categoria: monto}
        List<Map<String, Object>> gastosPorCategoria = gastosPorCategoriaMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("nombre", entry.getKey());
                    item.put("totalGastado", entry.getValue());
                    return item;
                })
                .toList();

        Map<String, Object> reporte = new HashMap<>();
        reporte.put("usuario_id", idUsuario);
        reporte.put("mes", mes);
        reporte.put("anio", anio);
        reporte.put("total_ingresos", totalIngresos);
        reporte.put("total_gastos", totalGastos);
        reporte.put("saldo_neto", saldoNeto);
        reporte.put("gastos_por_categoria", gastosPorCategoria);
        reporte.put("total_transacciones", transacciones.size());

        return reporte;
    }
}

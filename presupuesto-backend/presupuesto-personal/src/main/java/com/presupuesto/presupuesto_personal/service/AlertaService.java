package com.presupuesto.presupuesto_personal.service;
import com.presupuesto.presupuesto_personal.model.Alerta;
import com.presupuesto.presupuesto_personal.model.Presupuesto;
import com.presupuesto.presupuesto_personal.model.Usuario;
import com.presupuesto.presupuesto_personal.repository.AlertaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal; import java.util.List;
@Service
public class AlertaService {
    @Autowired
    private AlertaRepository alertaRepository;
    public Alerta crear(Usuario usuario, Presupuesto presupuesto, BigDecimal montoGastado) {
        Alerta alerta = Alerta.builder()
                .usuario(usuario)
                .presupuesto(presupuesto)
                .mensaje("Superaste el presupuesto de " +
                        presupuesto.getCategoria().getNombre())
                .montoGastado(montoGastado)
                .montoLimite(presupuesto.getMontoMaximo())
                .leida(false) .build();
        return alertaRepository.save(alerta);
    }
    public List<Alerta> listarPorUsuario(Long idUsuario) {
        return alertaRepository.findByUsuarioId(idUsuario);
    }
    public Alerta marcarComoLeida(Long id) {
        Alerta alerta = alertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));
        alerta.setLeida(true);
        return alertaRepository.save(alerta); }
}
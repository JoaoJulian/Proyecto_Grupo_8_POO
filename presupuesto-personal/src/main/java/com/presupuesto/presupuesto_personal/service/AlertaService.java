package com.presupuesto.presupuesto_personal.service;
import com.presupuesto.presupuesto_personal.dto.AlertaResponseDTO;
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

    public Alerta crearSiNoExiste(Presupuesto presupuesto, BigDecimal montoGastado) {

        boolean yaExiste = alertaRepository
                .existsByPresupuestoIdAndLeidaFalse(presupuesto.getId());

        if (yaExiste) {
            return null; // evita spam de alertas
        }

        Alerta alerta = Alerta.builder()
                .usuario(presupuesto.getUsuario())
                .presupuesto(presupuesto)
                .mensaje("Superaste el presupuesto de " +
                        presupuesto.getCategoria().getNombre())
                .montoGastado(montoGastado)
                .montoLimite(presupuesto.getMontoMaximo())
                .leida(false)
                .build();

        return alertaRepository.save(alerta);
    }

    public List<AlertaResponseDTO> listarPorUsuario(Long idUsuario) {
        return alertaRepository.findByUsuarioId(idUsuario).stream().map(this::toResponseDTO).toList();
    }

    public AlertaResponseDTO marcarComoLeida(Long id) {
        Alerta alerta = alertaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerta no encontrada"));
        alerta.setLeida(true);
        Alerta guardada = alertaRepository.save(alerta);
        return toResponseDTO(guardada);
    }

    private AlertaResponseDTO toResponseDTO(Alerta a) {
        return AlertaResponseDTO.builder()
                .id(a.getId())
                .idUsuario(a.getUsuario().getId())
                .idPresupuesto(a.getPresupuesto().getId())
                .mensaje(a.getMensaje())
                .montoGastado(a.getMontoGastado())
                .montoLimite(a.getMontoLimite())
                .fechaAlerta(a.getFechaAlerta())
                .leida(a.getLeida())
                .build();
    }
}
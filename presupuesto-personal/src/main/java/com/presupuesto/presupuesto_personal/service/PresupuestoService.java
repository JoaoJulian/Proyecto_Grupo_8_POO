package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.dto.CategoriaResponseDTO;
import com.presupuesto.presupuesto_personal.dto.PresupuestoRequestDTO;
import com.presupuesto.presupuesto_personal.dto.PresupuestoResponseDTO;
import com.presupuesto.presupuesto_personal.model.*;
import com.presupuesto.presupuesto_personal.repository.CategoriaRepository;
import com.presupuesto.presupuesto_personal.repository.PresupuestoRepository;
import com.presupuesto.presupuesto_personal.repository.TransaccionRepository;
import com.presupuesto.presupuesto_personal.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PresupuestoService {

    @Autowired
    private  PresupuestoRepository presupuestoRepository;

    @Autowired
    private TransaccionRepository transaccionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private AlertaService alertaService;

    public PresupuestoResponseDTO crear(PresupuestoRequestDTO dto, String emailUsuarioActual) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioActual)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Optional<Presupuesto> existente = presupuestoRepository
                .findByUsuarioIdAndCategoriaIdAndMesAndAnioAndActivoTrue(
                        usuario.getId(), dto.getIdCategoria(), dto.getMes(), dto.getAnio());
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un presupuesto para esa categoría en ese mes y año.");
        }

        Presupuesto presupuesto = Presupuesto.builder()
                .usuario(usuario)
                .categoria(categoria)
                .montoMaximo(dto.getMontoMaximo())
                .mes(dto.getMes())
                .anio(dto.getAnio())
                .activo(true)
                .build();

        Presupuesto guardado = presupuestoRepository.save(presupuesto);
        return toResponseDTO(guardado);
    }

    public List<PresupuestoResponseDTO> listarPorUsuario(Long usuarioId) {
        return presupuestoRepository.findByUsuarioIdAndActivoTrue(usuarioId)
                .stream().map(this::toResponseDTO).toList();
    }

    public List<PresupuestoResponseDTO> listarPorUsuarioMesAnio(Long usuarioId, Integer mes, Integer anio) {
        return presupuestoRepository.findByUsuarioIdAndMesAndAnioAndActivoTrue(usuarioId, mes, anio)
                .stream().map(this::toResponseDTO).toList();
    }

    public PresupuestoResponseDTO buscarPorId(Long id) {
        return toResponseDTO(buscarEntidadPorId(id));
    }

    private Presupuesto buscarEntidadPorId(Long id) {
        return presupuestoRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado con id: " + id));
    }

    public PresupuestoResponseDTO actualizar(Long id, PresupuestoRequestDTO dto) {
        Presupuesto existente = buscarEntidadPorId(id);

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        existente.setMontoMaximo(dto.getMontoMaximo());
        existente.setMes(dto.getMes());
        existente.setAnio(dto.getAnio());
        existente.setCategoria(categoria);

        Presupuesto guardado = presupuestoRepository.save(existente);
        return toResponseDTO(guardado);
    }

    public void eliminar(Long id) {
        Presupuesto presupuesto = buscarEntidadPorId(id);
        presupuesto.setActivo(false);
        presupuestoRepository.save(presupuesto);
    }

    // Verificar si el gasto del mes superó el presupuesto (RF5)
    public String verificarAlerta(Long idUsuario, Long idCategoria, Integer mes, Integer anio) {
        Presupuesto presupuesto = presupuestoRepository
                .findByUsuarioIdAndCategoriaIdAndMesAndAnioAndActivoTrue(idUsuario, idCategoria, mes, anio)
                .orElseThrow(() -> new RuntimeException("No hay presupuesto definido para esa categoría en ese mes"));

        LocalDate inicio = LocalDate.of(anio, mes, 1);
        LocalDate fin = inicio.withDayOfMonth(inicio.lengthOfMonth());

        List<Transaccion> transacciones = transaccionRepository
                .findByUsuarioIdAndFechaTransaccionBetweenAndActivoTrue(idUsuario, inicio, fin);

        BigDecimal totalGastado = transacciones.stream()
                .filter(t -> t.getCategoria() != null
                        && t.getCategoria().getId().equals(idCategoria)
                        && t.getTipo() == TipoTransaccion.GASTO)
                .map(Transaccion::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        boolean superado = totalGastado.compareTo(presupuesto.getMontoMaximo()) > 0;

        presupuesto.setAlertaActivada(superado);
        presupuestoRepository.save(presupuesto);

        if (superado) {
            alertaService.crearSiNoExiste(presupuesto, totalGastado);
            return "ALERTA: Superaste tu presupuesto. Gastado: S/." + totalGastado
                    + " / Máximo: S/." + presupuesto.getMontoMaximo();
        }

        return "Dentro del presupuesto. Gastado: S/." + totalGastado
                + " / Máximo: S/." + presupuesto.getMontoMaximo();
    }

    private PresupuestoResponseDTO toResponseDTO(Presupuesto p) {
        CategoriaResponseDTO categoriaDTO = CategoriaResponseDTO.builder()
                .id(p.getCategoria().getId())
                .nombre(p.getCategoria().getNombre())
                .tipo(p.getCategoria().getTipo())
                .descripcion(p.getCategoria().getDescripcion())
                .idUsuario(p.getCategoria().getUsuario().getId())
                .build();

        return PresupuestoResponseDTO.builder()
                .id(p.getId())
                .montoMaximo(p.getMontoMaximo())
                .mes(p.getMes())
                .anio(p.getAnio())
                .alertaActivada(p.getAlertaActivada())
                .idUsuario(p.getUsuario().getId())
                .categoria(categoriaDTO)
                .build();
    }
}
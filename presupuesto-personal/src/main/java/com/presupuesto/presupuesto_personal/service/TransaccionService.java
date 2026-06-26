package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.dto.CategoriaResponseDTO;
import com.presupuesto.presupuesto_personal.dto.TransaccionRequestDTO;
import com.presupuesto.presupuesto_personal.dto.TransaccionResponseDTO;
import com.presupuesto.presupuesto_personal.model.Categoria;
import com.presupuesto.presupuesto_personal.model.Transaccion;
import com.presupuesto.presupuesto_personal.model.TipoTransaccion;
import com.presupuesto.presupuesto_personal.model.Usuario;
import com.presupuesto.presupuesto_personal.repository.CategoriaRepository;
import com.presupuesto.presupuesto_personal.repository.TransaccionRepository;
import com.presupuesto.presupuesto_personal.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransaccionService {

    @Autowired
    private TransaccionRepository transaccionRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private BitacoraService bitacoraService;

    public TransaccionResponseDTO  guardar(TransaccionRequestDTO dto, String emailUsuarioActual) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioActual)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Transaccion transaccion = Transaccion.builder()
                .usuario(usuario)
                .categoria(categoria)
                .monto(dto.getMonto())
                .tipo(dto.getTipo())
                .descripcion(dto.getDescripcion())
                .fechaTransaccion(dto.getFechaTransaccion())
                .activo(true)
                .build();

        Transaccion guardada = transaccionRepository.save(transaccion);

        // Registrar en bitácora después de guardar
        bitacoraService.registrar(
                guardada.getUsuario(),
                "CREAR",
                "transaccion",
                guardada.getId(),
                "Se registró una transacción de " + guardada.getTipo() + " por S/." + guardada.getMonto()
        );

        return toResponseDTO(guardada);
    }

    public TransaccionResponseDTO  actualizar(Long id, TransaccionRequestDTO datos) {
        Transaccion existente = transaccionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

        Categoria categoria = categoriaRepository.findById(datos.getIdCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        existente.setTipo(datos.getTipo());
        existente.setMonto(datos.getMonto());
        existente.setDescripcion(datos.getDescripcion());
        existente.setFechaTransaccion(datos.getFechaTransaccion());
        existente.setCategoria(categoria);

        Transaccion actualizada = transaccionRepository.save(existente);

        bitacoraService.registrar(
                actualizada.getUsuario(),
                "EDITAR",
                "transaccion",
                actualizada.getId(),
                "Se editó una transacción de " + actualizada.getTipo() + " por S/." + actualizada.getMonto()
        );

        return toResponseDTO(actualizada);
    }

    public void eliminar(Long id) {
        Transaccion existente = transaccionRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new RuntimeException("Transacción no encontrada"));

        existente.setActivo(false);

        transaccionRepository.save(existente);

        bitacoraService.registrar(
                existente.getUsuario(),
                "ELIMINAR",
                "transaccion",
                existente.getId(),
                "Se eliminó una transacción de " + existente.getTipo() + " por S/." + existente.getMonto()
        );
    }

    public List<TransaccionResponseDTO> listarTodasActivas() {
        return transaccionRepository.findAll().stream()
                .filter(Transaccion::getActivo)
                .map(this::toResponseDTO)
                .toList();
    }

    // Requerido por TransaccionController: lista todas las transacciones de un usuario
    public List<TransaccionResponseDTO> listarPorUsuario(Long idUsuario) {
        return transaccionRepository.findByUsuarioIdAndActivoTrue(idUsuario).stream().map(this::toResponseDTO).toList();
    }

    // Requerido por TransaccionController: filtra por usuario y tipo (INGRESO/GASTO)
    public List<TransaccionResponseDTO> listarPorUsuarioYTipo(Long idUsuario, TipoTransaccion tipo) {
        return transaccionRepository.findByUsuarioIdAndTipoAndActivoTrue(idUsuario, tipo).stream().map(this::toResponseDTO).toList();
    }

    // Requerido por TransaccionController: filtra por usuario y rango de fechas (RF4 - reportes)
    public List<TransaccionResponseDTO> listarPorRangoFechas(Long idUsuario, LocalDate fechaInicio, LocalDate fechaFin) {
        return transaccionRepository.findByUsuarioIdAndFechaTransaccionBetweenAndActivoTrue(idUsuario, fechaInicio, fechaFin)
                .stream().map(this::toResponseDTO).toList();
    }

    private TransaccionResponseDTO toResponseDTO(Transaccion t) {
        CategoriaResponseDTO categoriaDTO = CategoriaResponseDTO.builder()
                .id(t.getCategoria().getId())
                .nombre(t.getCategoria().getNombre())
                .tipo(t.getCategoria().getTipo())
                .descripcion(t.getCategoria().getDescripcion())
                .idUsuario(t.getCategoria().getUsuario().getId())
                .build();

        return TransaccionResponseDTO.builder()
                .id(t.getId())
                .monto(t.getMonto())
                .tipo(t.getTipo())
                .descripcion(t.getDescripcion())
                .fechaTransaccion(t.getFechaTransaccion())
                .idUsuario(t.getUsuario().getId())
                .categoria(categoriaDTO)
                .build();
    }
}
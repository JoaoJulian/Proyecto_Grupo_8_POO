package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.dto.CategoriaRequestDTO;
import com.presupuesto.presupuesto_personal.dto.CategoriaResponseDTO;
import com.presupuesto.presupuesto_personal.dto.CategoriaUpdateDTO;
import com.presupuesto.presupuesto_personal.model.Categoria;
import com.presupuesto.presupuesto_personal.model.Usuario;
import com.presupuesto.presupuesto_personal.repository.CategoriaRepository;
import com.presupuesto.presupuesto_personal.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    // Listar todas las categorías de un usuario
    public List<CategoriaResponseDTO> listarPorUsuario(Long idUsuario) {
        return categoriaRepository.findByUsuarioIdAndActivoTrue(idUsuario)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // Listar categorías de un usuario por tipo (INGRESO o GASTO)
    public List<CategoriaResponseDTO> listarPorTipo(Long idUsuario, String tipo) {
        return categoriaRepository.findByUsuarioIdAndTipoAndActivoTrue(idUsuario, tipo)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    // Guardar nueva categoría (valida duplicados)
    public CategoriaResponseDTO  guardar(CategoriaRequestDTO dto, String emailUsuarioActual) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioActual)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        boolean yaExiste = categoriaRepository.existsByNombreAndUsuarioIdAndActivoTrue(
                dto.getNombre(), usuario.getId()
        );
        if (yaExiste) {
            throw new RuntimeException("Ya existe una categoría con ese nombre para este usuario");
        }

        Categoria categoria = Categoria.builder()
                .nombre(dto.getNombre())
                .tipo(dto.getTipo())
                .descripcion(dto.getDescripcion())
                .usuario(usuario)
                .activo(true)
                .build();

        Categoria guardada = categoriaRepository.save(categoria);
        return toResponseDTO(guardada);
    }

    // Actualizar categoría existente
    public CategoriaResponseDTO actualizar(Long id, CategoriaUpdateDTO datosNuevos) {
        Categoria categoria = categoriaRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));

        if (!categoria.getActivo()) {
            throw new RuntimeException("No se puede actualizar una categoría eliminada");
        }

        categoria.setNombre(datosNuevos.getNombre());
        categoria.setTipo(datosNuevos.getTipo());
        categoria.setDescripcion(datosNuevos.getDescripcion());

        Categoria guardada = categoriaRepository.save(categoria);
        return toResponseDTO(guardada);
    }

    // Eliminar categoría
    public void eliminar(Long id) {
        Categoria categoria = categoriaRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));

        categoria.setActivo(false);

        categoriaRepository.save(categoria);
    }

    private CategoriaResponseDTO toResponseDTO(Categoria categoria) {
        return CategoriaResponseDTO.builder()
                .id(categoria.getId())
                .nombre(categoria.getNombre())
                .tipo(categoria.getTipo())
                .descripcion(categoria.getDescripcion())
                .idUsuario(categoria.getUsuario().getId())
                .build();
    }
}
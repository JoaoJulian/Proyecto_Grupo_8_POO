package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.model.Categoria;
import com.presupuesto.presupuesto_personal.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // Listar todas las categorías de un usuario
    public List<Categoria> listarPorUsuario(Long idUsuario) {
        return categoriaRepository.findByUsuarioId(idUsuario);
    }

    // Listar categorías de un usuario por tipo (INGRESO o GASTO)
    public List<Categoria> listarPorTipo(Long idUsuario, String tipo) {
        return categoriaRepository.findByUsuarioIdAndTipo(idUsuario, tipo);
    }

    // Guardar nueva categoría (valida duplicados)
    public Categoria guardar(Categoria categoria) {
        boolean yaExiste = categoriaRepository.existsByNombreAndUsuarioId(
                categoria.getNombre(),
                categoria.getUsuario().getId()
        );
        if (yaExiste) {
            throw new RuntimeException("Ya existe una categoría con ese nombre para este usuario");
        }
        return categoriaRepository.save(categoria);
    }

    // Actualizar categoría existente
    public Categoria actualizar(Long id, Categoria datosNuevos) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con id: " + id));

        categoria.setNombre(datosNuevos.getNombre());
        categoria.setTipo(datosNuevos.getTipo());
        categoria.setDescripcion(datosNuevos.getDescripcion());

        return categoriaRepository.save(categoria);
    }

    // Eliminar categoría
    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada con id: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}
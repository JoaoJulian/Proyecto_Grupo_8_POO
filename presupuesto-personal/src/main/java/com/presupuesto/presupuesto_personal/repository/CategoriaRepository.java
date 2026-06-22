package com.presupuesto.presupuesto_personal.repository;

import com.presupuesto.presupuesto_personal.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    Optional<Categoria> findByIdAndActivoTrue(Long id);

    // Listar todas las categorías de un usuario
    List<Categoria> findByUsuarioIdAndActivoTrue(Long idUsuario);

    // Listar categorías de un usuario filtradas por tipo (INGRESO o GASTO)
    List<Categoria> findByUsuarioIdAndTipoAndActivoTrue(Long idUsuario, String tipo);

    // Verificar si ya existe una categoría con ese nombre para ese usuario
    boolean existsByNombreAndUsuarioIdAndActivoTrue(String nombre, Long idUsuario);
}
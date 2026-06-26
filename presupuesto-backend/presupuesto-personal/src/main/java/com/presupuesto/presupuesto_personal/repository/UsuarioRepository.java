package com.presupuesto.presupuesto_personal.repository;

import com.presupuesto.presupuesto_personal.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuario por email (útil para login o validar duplicados)
    Optional<Usuario> findByEmail(String email);

    // Verificar si ya existe un email registrado
    boolean existsByEmail(String email);
}
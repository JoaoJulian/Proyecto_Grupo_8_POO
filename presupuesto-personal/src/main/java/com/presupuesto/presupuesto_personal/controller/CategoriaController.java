package com.presupuesto.presupuesto_personal.controller;

import com.presupuesto.presupuesto_personal.dto.CategoriaRequestDTO;
import com.presupuesto.presupuesto_personal.dto.CategoriaResponseDTO;
import com.presupuesto.presupuesto_personal.dto.CategoriaUpdateDTO;
import com.presupuesto.presupuesto_personal.model.Categoria;
import com.presupuesto.presupuesto_personal.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    // GET /api/categorias/usuario/{idUsuario}
    // Lista todas las categorías de un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<CategoriaResponseDTO>> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(categoriaService.listarPorUsuario(idUsuario));
    }

    // GET /api/categorias/usuario/{idUsuario}/tipo/{tipo}
    // Lista categorías filtradas por tipo (INGRESO o GASTO)
    @GetMapping("/usuario/{idUsuario}/tipo/{tipo}")
    public ResponseEntity<List<CategoriaResponseDTO>> listarPorTipo(@PathVariable Long idUsuario, @PathVariable String tipo) {
        return ResponseEntity.ok(categoriaService.listarPorTipo(idUsuario, tipo));
    }

    // POST /api/categorias
    // Crea una nueva categoría
    @PostMapping
    public ResponseEntity<CategoriaResponseDTO> crear(@RequestBody CategoriaRequestDTO categoria) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        CategoriaResponseDTO nueva = categoriaService.guardar(categoria, email);
        return ResponseEntity.status(201).body(nueva);
    }

    // PUT /api/categorias/{id}
    // Actualiza una categoría existente
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> actualizar(@PathVariable Long id, @RequestBody CategoriaUpdateDTO categoria) {
        CategoriaResponseDTO actualizada = categoriaService.actualizar(id, categoria);
        return ResponseEntity.ok(actualizada);
    }

    // DELETE /api/categorias/{id}
    // Elimina una categoría
    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<String> desactivar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.ok("Categoría desactivada correctamente");
    }
}
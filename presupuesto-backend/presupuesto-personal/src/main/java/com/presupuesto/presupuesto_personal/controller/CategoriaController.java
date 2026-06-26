package com.presupuesto.presupuesto_personal.controller;

import com.presupuesto.presupuesto_personal.model.Categoria;
import com.presupuesto.presupuesto_personal.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public List<Categoria> listarPorUsuario(@PathVariable Long idUsuario) {
        return categoriaService.listarPorUsuario(idUsuario);
    }

    // GET /api/categorias/usuario/{idUsuario}/tipo/{tipo}
    // Lista categorías filtradas por tipo (INGRESO o GASTO)
    @GetMapping("/usuario/{idUsuario}/tipo/{tipo}")
    public List<Categoria> listarPorTipo(
            @PathVariable Long idUsuario,
            @PathVariable String tipo) {
        return categoriaService.listarPorTipo(idUsuario, tipo);
    }

    // POST /api/categorias
    // Crea una nueva categoría
    @PostMapping
    public ResponseEntity<Categoria> crear(@RequestBody Categoria categoria) {
        Categoria nueva = categoriaService.guardar(categoria);
        return ResponseEntity.status(201).body(nueva);
    }

    // PUT /api/categorias/{id}
    // Actualiza una categoría existente
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(
            @PathVariable Long id,
            @RequestBody Categoria categoria) {
        Categoria actualizada = categoriaService.actualizar(id, categoria);
        return ResponseEntity.ok(actualizada);
    }

    // DELETE /api/categorias/{id}
    // Elimina una categoría
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.ok("Categoría eliminada correctamente");
    }
}
package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.model.Presupuesto;
import com.presupuesto.presupuesto_personal.repository.PresupuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PresupuestoService {

    @Autowired
    private  PresupuestoRepository presupuestoRepository;

    // Crear presupuesto
    public Presupuesto crear(Presupuesto presupuesto) {
        // Verifica que no exista ya uno para la misma combinación
        Optional<Presupuesto> existente = presupuestoRepository
                .findByUsuarioIdAndCategoriaIdAndMesAndAnio(
                        presupuesto.getUsuario().getId(),
                        presupuesto.getCategoria().getId(),
                        presupuesto.getMes(),
                        presupuesto.getAnio()
                );
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe un presupuesto para esa categoría en ese mes y año.");
        }
        return presupuestoRepository.save(presupuesto);
    }

    // Listar por usuario
    public List<Presupuesto> listarPorUsuario(Long usuarioId){
        return presupuestoRepository.findByUsuarioId(usuarioId);
    }

    // Listar por usuario, mes y año
    public List<Presupuesto> listarPorUsuarioMesAnio(Long usuarioId, Integer mes, Integer anio) {
        return presupuestoRepository.findByUsuarioIdAndMesAndAnio(usuarioId, mes, anio);
    }

    // Buscar por ID
    public Presupuesto buscarPorId(Long id) {
        return presupuestoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado con id: " + id));
    }

    // Actualizar
    public Presupuesto actualizar(Long id, Presupuesto datos) {
        Presupuesto existente = buscarPorId(id);
        existente.setMontoMaximo(datos.getMontoMaximo());
        existente.setMes(datos.getMes());
        existente.setAnio(datos.getAnio());
        existente.setCategoria(datos.getCategoria());
        return presupuestoRepository.save(existente);
    }

    // Eliminar
    public void eliminar(Long id) {
        buscarPorId(id); // verifica que existe antes de eliminar
        presupuestoRepository.deleteById(id);
    }
}

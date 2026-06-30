package com.presupuesto.presupuesto_personal.service;

import com.presupuesto.presupuesto_personal.dto.BitacoraResponseDTO;
import com.presupuesto.presupuesto_personal.model.Bitacora;
import com.presupuesto.presupuesto_personal.model.Usuario;
import com.presupuesto.presupuesto_personal.repository.BitacoraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BitacoraService {

    @Autowired
    private BitacoraRepository bitacoraRepository;

    public void registrar(Usuario usuario, String accion, String tablaAfectada,
                          Long idRegistro, String detalle) {
        Bitacora registro = Bitacora.builder()
                .usuario(usuario)
                .accion(accion)
                .tablaAfectada(tablaAfectada)
                .idRegistroAfectado(idRegistro)
                .detalle(detalle)
                .build();
        bitacoraRepository.save(registro);
    }

    public List<BitacoraResponseDTO> listarPorUsuario(Long idUsuario) {
        return bitacoraRepository.findByUsuarioId(idUsuario).stream().map(this::toResponseDTO).toList();
    }

    public List<BitacoraResponseDTO> listarPorTabla(String tablaAfectada) {
        return bitacoraRepository.findByTablaAfectada(tablaAfectada).stream().map(this::toResponseDTO).toList();
    }

    private BitacoraResponseDTO toResponseDTO(Bitacora b) {
        return BitacoraResponseDTO.builder()
                .id(b.getId())
                .idUsuario(b.getUsuario().getId())
                .accion(b.getAccion())
                .tablaAfectada(b.getTablaAfectada())
                .idRegistroAfectado(b.getIdRegistroAfectado())
                .detalle(b.getDetalle())
                .fechaAccion(b.getFechaAccion())
                .build();
    }
}

package com.presupuesto.presupuesto_personal.service;

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

    public List<Bitacora> listarPorUsuario(Long idUsuario) {
        return bitacoraRepository.findByUsuarioId(idUsuario);
    }

    public List<Bitacora> listarPorTabla(String tablaAfectada) {
        return bitacoraRepository.findByTablaAfectada(tablaAfectada);
    }
}

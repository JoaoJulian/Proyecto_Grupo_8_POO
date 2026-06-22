package com.presupuesto.presupuesto_personal.service;
import com.presupuesto.presupuesto_personal.dto.GrupoMiembroResponseDTO;
import com.presupuesto.presupuesto_personal.dto.GrupoRequestDTO;
import com.presupuesto.presupuesto_personal.dto.GrupoResponseDTO;
import com.presupuesto.presupuesto_personal.model.*;
import com.presupuesto.presupuesto_personal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class GrupoService {

    @Autowired private GrupoRepository grupoRepository;
    @Autowired private GrupoMiembroRepository grupoMiembroRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    public GrupoResponseDTO crear(GrupoRequestDTO request, String emailUsuario) {

        Usuario creador = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Grupo grupo = Grupo.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .creador(creador)
                .activo(true)
                .build();

        Grupo guardado = grupoRepository.save(grupo);

        GrupoMiembro miembro = GrupoMiembro.builder()
                .grupo(guardado)
                .usuario(creador)
                .rol(GrupoMiembro.RolGrupo.ADMIN)
                .activo(true)
                .build();

        grupoMiembroRepository.save(miembro);

        return GrupoResponseDTO.builder()
                .id(guardado.getId())
                .nombre(guardado.getNombre())
                .descripcion(guardado.getDescripcion())
                .creador(guardado.getCreador().getNombre())
                .fechaCreacion(guardado.getFechaCreacion())
                .build();
    }

    public GrupoMiembroResponseDTO invitar(Long idGrupo, String emailInvitado) {

        Usuario usuario = usuarioRepository.findByEmail(emailInvitado)
                .orElseThrow(() -> new RuntimeException("No existe un usuario con ese email"));

        Grupo grupo = grupoRepository.findById(idGrupo)
                .orElseThrow(() -> new RuntimeException("Grupo no encontrado"));

        if (!grupo.getActivo()) {
            throw new RuntimeException("El grupo está eliminado");
        }

        if (grupoMiembroRepository.existsByGrupoIdAndUsuarioIdAndActivoTrue(idGrupo, usuario.getId())) {
            throw new RuntimeException("El usuario ya pertenece a este grupo");
        }

        GrupoMiembro miembro = GrupoMiembro.builder()
                .grupo(grupo)
                .usuario(usuario)
                .rol(GrupoMiembro.RolGrupo.MIEMBRO)
                .activo(true)
                .build();

        GrupoMiembro guardado = grupoMiembroRepository.save(miembro);
        return toMiembroDTO(guardado);
    }

    public List<GrupoMiembroResponseDTO> listarMiembros(Long idGrupo) {
        return grupoMiembroRepository.findByGrupoIdAndActivoTrue(idGrupo)
                .stream().map(this::toMiembroDTO).toList();
    }

    public List<GrupoResponseDTO> listarPorUsuario(Long idUsuario) {

        return grupoMiembroRepository.findByUsuarioIdAndActivoTrue(idUsuario)
                .stream()
                .map(GrupoMiembro::getGrupo)
                .filter(Grupo::getActivo)
                .map(this::toGrupoDTO)
                .toList();
    }

    public void salirDelGrupo(Long idGrupo, Long idUsuario) {
        GrupoMiembro miembro = grupoMiembroRepository
                .findByGrupoIdAndUsuarioIdAndActivoTrue(idGrupo, idUsuario)
                .orElseThrow(() -> new RuntimeException("El usuario no pertenece a este grupo"));
        miembro.setActivo(false);
        grupoMiembroRepository.save(miembro);
    }

    private GrupoMiembroResponseDTO toMiembroDTO(GrupoMiembro m) {
        return GrupoMiembroResponseDTO.builder()
                .id(m.getId())
                .idGrupo(m.getGrupo().getId())
                .idUsuario(m.getUsuario().getId())
                .nombreUsuario(m.getUsuario().getNombre())
                .emailUsuario(m.getUsuario().getEmail())
                .rol(m.getRol().name())
                .fechaUnion(m.getFechaUnion())
                .build();
    }

    private GrupoResponseDTO toGrupoDTO(Grupo g) {
        return GrupoResponseDTO.builder()
                .id(g.getId())
                .nombre(g.getNombre())
                .descripcion(g.getDescripcion())
                .creador(g.getCreador().getNombre())
                .fechaCreacion(g.getFechaCreacion())
                .build();
    }
}

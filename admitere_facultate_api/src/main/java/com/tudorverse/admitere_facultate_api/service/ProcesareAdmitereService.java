package com.tudorverse.admitere_facultate_api.service;

import com.tudorverse.admitere_facultate_api.dto.ProcesareAdmitereResponse;
import com.tudorverse.admitere_facultate_api.dto.ProgramStudiuResponse;
import com.tudorverse.admitere_facultate_api.dto.RezultatAdmitereResponse;
import com.tudorverse.admitere_facultate_api.model.Candidat;
import com.tudorverse.admitere_facultate_api.model.Dosar;
import com.tudorverse.admitere_facultate_api.model.Optiune;
import com.tudorverse.admitere_facultate_api.repository.CandidatRepository;
import com.tudorverse.admitere_facultate_api.repository.DosarRepository;
import com.tudorverse.admitere_facultate_api.repository.OptiuneRepository;
import com.tudorverse.admitere_facultate_api.repository.ProgramStudiuRepository;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service that processes validated applications and assigns available seats.
 */
@Service
public class ProcesareAdmitereService {

  private final DosarRepository dosarRepository;
  private final OptiuneRepository optiuneRepository;
  private final ProgramStudiuRepository programStudiuRepository;
  private final CandidatRepository candidatRepository;

  // In-memory cache of the last processing run (cleared on restart).
  private volatile List<RezultatAdmitereResponse> ultimeleRezultate = List.of();

  public ProcesareAdmitereService(DosarRepository dosarRepository,
      OptiuneRepository optiuneRepository,
      ProgramStudiuRepository programStudiuRepository,
      CandidatRepository candidatRepository) {
    this.dosarRepository = dosarRepository;
    this.optiuneRepository = optiuneRepository;
    this.programStudiuRepository = programStudiuRepository;
    this.candidatRepository = candidatRepository;
  }

  @Transactional(readOnly = true)
  public ProcesareAdmitereResponse proceseazaAdmitere() {
    List<Dosar> dosare = dosarRepository.findByStatusAndMedieIsNotNull("VALIDAT");
    dosare.sort(ProcesareAdmitereService::compareDosare);

    if (dosare.isEmpty()) {
      ultimeleRezultate = List.of();
      return new ProcesareAdmitereResponse(0, 0, 0);
    }

    List<Long> dosarIds = dosare.stream().map(Dosar::getId).toList();
    List<Optiune> optiuni = optiuneRepository
        .findByDosarIdInOrderByDosarIdAscPrioritateAsc(dosarIds);

    Map<Long, List<Optiune>> optiuniByDosar = new HashMap<>();
    for (Optiune optiune : optiuni) {
      optiuniByDosar.computeIfAbsent(optiune.getDosarId(), id -> new ArrayList<>())
          .add(optiune);
    }

    Set<Long> candidatIds = dosare.stream()
        .map(Dosar::getCandidatId)
        .collect(Collectors.toSet());
    Map<Long, Candidat> candidati = new HashMap<>();
    for (Candidat candidat : candidatRepository.findAllById(candidatIds)) {
      candidati.put(candidat.getId(), candidat);
    }

    Map<Long, ProgramStudiuResponse> programe = new HashMap<>();
    Map<Long, Integer> locuriDisponibile = new HashMap<>();
    for (ProgramStudiuResponse program : programStudiuRepository.findAllWithFacultate()) {
      int total = program.locuriBuget() + program.locuriTaxa();
      programe.put(program.id(), program);
      locuriDisponibile.put(program.id(), total);
    }

    int dosareProcesate = 0;
    int dosareAdmise = 0;
    int dosareNealocate = 0;
    List<RezultatAdmitereResponse> rezultate = new ArrayList<>();

    for (Dosar dosar : dosare) {
      dosareProcesate++;
      List<Optiune> optiuniDosar = optiuniByDosar.get(dosar.getId());
      Long programAfisatId = null;
      Integer prioritate = null;
      boolean admis = false;

      if (optiuniDosar != null && !optiuniDosar.isEmpty()) {
        Optiune primaOptiune = optiuniDosar.get(0);
        for (Optiune optiune : optiuniDosar) {
          Integer locuri = locuriDisponibile.get(optiune.getProgramId());
          if (locuri == null || locuri <= 0) {
            continue;
          }
          locuriDisponibile.put(optiune.getProgramId(), locuri - 1);
          programAfisatId = optiune.getProgramId();
          prioritate = optiune.getPrioritate();
          admis = true;
          break;
        }
        if (!admis && primaOptiune != null) {
          programAfisatId = primaOptiune.getProgramId();
          prioritate = primaOptiune.getPrioritate();
        }
      }

      if (!admis) {
        dosareNealocate++;
      } else {
        dosareAdmise++;
      }

      ProgramStudiuResponse program = programAfisatId == null
          ? null
          : programe.get(programAfisatId);
      Candidat candidat = candidati.get(dosar.getCandidatId());
      String nume = candidat == null ? "" : candidat.getNume();
      String prenume = candidat == null ? "" : candidat.getPrenume();

      rezultate.add(new RezultatAdmitereResponse(
          dosar.getId(),
          dosar.getCandidatId(),
          nume,
          prenume,
          dosar.getMedie(),
          dosar.getCreatedAt(),
          prioritate,
          admis ? "ADMIS" : "RESPINS",
          program == null ? null : program.id(),
          program == null ? null : program.nume(),
          program == null ? null : program.facultateNume()));
    }

    ultimeleRezultate = List.copyOf(rezultate);
    return new ProcesareAdmitereResponse(dosareProcesate, dosareAdmise, dosareNealocate);
  }

  public List<RezultatAdmitereResponse> getUltimeleRezultate() {
    return ultimeleRezultate;
  }

  private static int compareDosare(Dosar left, Dosar right) {
    int cmp = compareMedieDesc(left.getMedie(), right.getMedie());
    if (cmp != 0) {
      return cmp;
    }
    cmp = compareDateAsc(left.getCreatedAt(), right.getCreatedAt());
    if (cmp != 0) {
      return cmp;
    }
    return compareIdAsc(left.getId(), right.getId());
  }

  private static int compareMedieDesc(BigDecimal left, BigDecimal right) {
    if (left == null && right == null) {
      return 0;
    }
    if (left == null) {
      return 1;
    }
    if (right == null) {
      return -1;
    }
    return right.compareTo(left);
  }

  private static int compareDateAsc(OffsetDateTime left, OffsetDateTime right) {
    if (left == null && right == null) {
      return 0;
    }
    if (left == null) {
      return 1;
    }
    if (right == null) {
      return -1;
    }
    return left.compareTo(right);
  }

  private static int compareIdAsc(Long left, Long right) {
    if (left == null && right == null) {
      return 0;
    }
    if (left == null) {
      return 1;
    }
    if (right == null) {
      return -1;
    }
    return left.compareTo(right);
  }

}

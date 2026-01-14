package com.tudorverse.admitere_facultate_api.controller;

import com.tudorverse.admitere_facultate_api.dto.DosarResponse;
import com.tudorverse.admitere_facultate_api.model.Dosar;
import com.tudorverse.admitere_facultate_api.repository.DosarRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Endpoint-uri CRUD pentru tabela dosar.
 */
@RestController
@RequestMapping("/api/admin/dosare")
public class DosarController {

  private final DosarRepository dosarRepository;

  /**
   * Creeaza controller-ul cu dependinta de repository.
   */
  public DosarController(DosarRepository dosarRepository) {
    this.dosarRepository = dosarRepository;
  }

  /**
   * Listeaza toate dosarele sortate dupa id.
   */
  @GetMapping
  public List<DosarResponse> list() {
    return dosarRepository.findAllWithCandidat();
  }

  /**
   * Creeaza un dosar nou dupa validarea payload-ului.
   */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Dosar create(@RequestBody Dosar dosar) {
    if (dosar == null || dosar.getCandidatId() == null || isBlank(dosar.getStatus())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date incomplete");
    }
    Dosar payload = new Dosar();
    payload.setCandidatId(dosar.getCandidatId());
    payload.setStatus(dosar.getStatus().trim());
    payload.setMedie(dosar.getMedie());
    return dosarRepository.save(payload);
  }

  /**
   * Actualizeaza un dosar existent folosind id-ul si payload-ul furnizate.
   */
  @PutMapping("/{id}")
  public Dosar update(@PathVariable Long id, @RequestBody Dosar dosar) {
    Dosar existing = dosarRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dosar inexistent"));
    if (dosar == null || dosar.getCandidatId() == null || isBlank(dosar.getStatus())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date incomplete");
    }
    existing.setCandidatId(dosar.getCandidatId());
    existing.setStatus(dosar.getStatus().trim());
    existing.setMedie(dosar.getMedie());
    return dosarRepository.save(existing);
  }

  /**
   * Sterge dosarul identificat prin id.
   */
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    if (!dosarRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Dosar inexistent");
    }
    dosarRepository.deleteById(id);
  }

  /**
   * Returneaza true cand sirul este null sau contine doar spatii.
   */
  private boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
  }
}

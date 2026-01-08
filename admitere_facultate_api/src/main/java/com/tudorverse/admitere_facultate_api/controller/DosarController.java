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
 * CRUD endpoints for the dosar table.
 */
@RestController
@RequestMapping("/api/admin/dosare")
public class DosarController {

  private final DosarRepository dosarRepository;

  /**
   * Creates the controller with its repository dependency.
   */
  public DosarController(DosarRepository dosarRepository) {
    this.dosarRepository = dosarRepository;
  }

  /**
   * Lists all dosare sorted by id.
   */
  @GetMapping
  public List<DosarResponse> list() {
    return dosarRepository.findAllWithCandidat();
  }

  /**
   * Creates a new dosar after validating the payload.
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
   * Updates an existing dosar using the provided id and payload.
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
   * Deletes the dosar identified by id.
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
   * Returns true when the string is null or only whitespace.
   */
  private boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
  }
}

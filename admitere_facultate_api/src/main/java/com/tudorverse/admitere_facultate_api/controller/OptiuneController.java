package com.tudorverse.admitere_facultate_api.controller;

import com.tudorverse.admitere_facultate_api.model.Optiune;
import com.tudorverse.admitere_facultate_api.repository.OptiuneRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
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
 * CRUD endpoints for the optiune table.
 */
@RestController
@RequestMapping("/api/admin/optiuni")
public class OptiuneController {

  private final OptiuneRepository optiuneRepository;

  /**
   * Creates the controller with its repository dependency.
   */
  public OptiuneController(OptiuneRepository optiuneRepository) {
    this.optiuneRepository = optiuneRepository;
  }

  /**
   * Lists all optiuni sorted by id.
   */
  @GetMapping
  public List<Optiune> list() {
    return optiuneRepository.findAll(Sort.by("id"));
  }

  /**
   * Creates a new optiune from the request payload.
   */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Optiune create(@RequestBody Optiune optiune) {
    if (optiune == null || optiune.getDosarId() == null || optiune.getProgramId() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date incomplete");
    }
    Optiune payload = new Optiune();
    payload.setDosarId(optiune.getDosarId());
    payload.setProgramId(optiune.getProgramId());
    payload.setPrioritate(optiune.getPrioritate());
    return optiuneRepository.save(payload);
  }

  /**
   * Updates an existing optiune using the provided id and payload.
   */
  @PutMapping("/{id}")
  public Optiune update(@PathVariable Long id, @RequestBody Optiune optiune) {
    Optiune existing = optiuneRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Optiune inexistenta"));
    if (optiune == null || optiune.getDosarId() == null || optiune.getProgramId() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date incomplete");
    }
    existing.setDosarId(optiune.getDosarId());
    existing.setProgramId(optiune.getProgramId());
    existing.setPrioritate(optiune.getPrioritate());
    return optiuneRepository.save(existing);
  }

  /**
   * Deletes the optiune identified by id.
   */
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    if (!optiuneRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Optiune inexistenta");
    }
    optiuneRepository.deleteById(id);
  }

  /**
   * Returns true when the string is null or only whitespace.
   */
}

package com.tudorverse.admitere_facultate_api.controller;

import com.tudorverse.admitere_facultate_api.model.Facultate;
import com.tudorverse.admitere_facultate_api.repository.FacultateRepository;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * CRUD endpoints for the facultate table.
 */
@RestController
@RequestMapping("/api/admin/facultati")
public class FacultateController {

  private final FacultateRepository facultateRepository;

  /**
   * Creates the controller with its repository dependency.
   */
  public FacultateController(FacultateRepository facultateRepository) {
    this.facultateRepository = facultateRepository;
  }

  /**
   * Lists facultati, optionally filtered by a name query string.
   */
  @GetMapping
  public List<Facultate> list(@RequestParam(required = false) String q) {
    String query = normalize(q);
    if (query == null) {
      return facultateRepository.findAll(Sort.by("id"));
    }
    return facultateRepository.findByNumeContainingIgnoreCaseOrderByNumeAsc(query);
  }

  /**
   * Creates a new facultate after validating the payload.
   */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Facultate create(@RequestBody Facultate facultate) {
    if (facultate == null || isBlank(facultate.getNume())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nume lipsa");
    }
    Facultate payload = new Facultate();
    payload.setNume(facultate.getNume().trim());
    return facultateRepository.save(payload);
  }

  /**
   * Updates the facultate name for the given id.
   */
  @PutMapping("/{id}")
  public Facultate update(@PathVariable Long id, @RequestBody Facultate facultate) {
    Facultate existing = facultateRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Facultate inexistenta"));
    if (facultate == null || isBlank(facultate.getNume())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nume lipsa");
    }
    existing.setNume(facultate.getNume().trim());
    return facultateRepository.save(existing);
  }

  /**
   * Deletes the facultate identified by id.
   */
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    if (!facultateRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Facultate inexistenta");
    }
    facultateRepository.deleteById(id);
  }

  /**
   * Returns true when the string is null or only whitespace.
   */
  private boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
  }

  /**
   * Trims the input and returns null when it is empty or null.
   */
  private String normalize(String value) {
    if (value == null) {
      return null;
    }
    String trimmed = value.trim();
    return trimmed.isEmpty() ? null : trimmed;
  }
}

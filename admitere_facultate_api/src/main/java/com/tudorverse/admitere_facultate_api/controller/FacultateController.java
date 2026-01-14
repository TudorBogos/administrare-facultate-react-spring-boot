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
 * Endpoint-uri CRUD pentru tabela facultate.
 */
@RestController
@RequestMapping("/api/admin/facultati")
public class FacultateController {

  private final FacultateRepository facultateRepository;

  /**
   * Creeaza controller-ul cu dependinta de repository.
   */
  public FacultateController(FacultateRepository facultateRepository) {
    this.facultateRepository = facultateRepository;
  }

  /**
   * Listeaza facultati, optional filtrate dupa un query de nume.
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
   * Creeaza o facultate noua dupa validarea payload-ului.
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
   * Actualizeaza numele facultatii pentru id-ul dat.
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
   * Sterge facultatea identificata prin id.
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
   * Returneaza true cand sirul este null sau contine doar spatii.
   */
  private boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
  }

  /**
   * Elimina spatiile de la capete si returneaza null cand este gol sau null.
   */
  private String normalize(String value) {
    if (value == null) {
      return null;
    }
    String trimmed = value.trim();
    return trimmed.isEmpty() ? null : trimmed;
  }
}

package com.tudorverse.admitere_facultate_api.controller;

import com.tudorverse.admitere_facultate_api.dto.CandidatUpsertRequest;
import com.tudorverse.admitere_facultate_api.model.Candidat;
import com.tudorverse.admitere_facultate_api.repository.CandidatRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
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
 * CRUD endpoints for candidati plus optional search filters.
 */
@RestController
@RequestMapping("/api/admin/candidati")
public class CandidatController {

  private final CandidatRepository candidatRepository;
  private final PasswordEncoder passwordEncoder;

  /**
   * Creates the controller with repository and password encoder dependencies.
   */
  public CandidatController(CandidatRepository candidatRepository, PasswordEncoder passwordEncoder) {
    this.candidatRepository = candidatRepository;
    this.passwordEncoder = passwordEncoder;
  }

  /**
   * Lists candidati filtered by optional nume, prenume, or email values.
   */
  @GetMapping
  public List<Candidat> list(@RequestParam(required = false) String nume,
      @RequestParam(required = false) String prenume,
      @RequestParam(required = false) String email) {
    String normalizedNume = normalizeFilter(nume);
    String normalizedPrenume = normalizeFilter(prenume);
    String normalizedEmail = normalizeFilter(email);

    if (normalizedNume == null && normalizedPrenume == null && normalizedEmail == null) {
      return candidatRepository.findAll(Sort.by("id"));
    }

    return candidatRepository.search(
        normalizedNume == null ? "" : normalizedNume,
        normalizedPrenume == null ? "" : normalizedPrenume,
        normalizedEmail == null ? "" : normalizedEmail);
  }

  /**
   * Creates a new candidat after normalizing fields and hashing the password.
   */
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Candidat create(@RequestBody CandidatUpsertRequest request) {
    if (request == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date incomplete");
    }
    String nume = normalize(request.nume());
    String prenume = normalize(request.prenume());
    String email = normalize(request.email());
    String parola = normalize(request.parola());
    if (nume == null || prenume == null || email == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date incomplete");
    }
    Candidat payload = new Candidat();
    payload.setNume(nume);
    payload.setPrenume(prenume);
    payload.setEmail(email);
    payload.setParolaHash(parola == null ? null : passwordEncoder.encode(parola));
    return candidatRepository.save(payload);
  }

  /**
   * Updates an existing candidat and optionally replaces the password hash.
   */
  @PutMapping("/{id}")
  public Candidat update(@PathVariable Long id, @RequestBody CandidatUpsertRequest request) {
    Candidat existing = candidatRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidat inexistent"));
    if (request == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date incomplete");
    }
    String nume = normalize(request.nume());
    String prenume = normalize(request.prenume());
    String email = normalize(request.email());
    String parola = normalize(request.parola());
    if (nume == null || prenume == null || email == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date incomplete");
    }
    existing.setNume(nume);
    existing.setPrenume(prenume);
    existing.setEmail(email);
    if (parola != null) {
      existing.setParolaHash(passwordEncoder.encode(parola));
    }
    return candidatRepository.save(existing);
  }

  /**
   * Deletes the candidat identified by id.
   */
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    if (!candidatRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidat inexistent");
    }
    candidatRepository.deleteById(id);
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

  /**
   * Normalizes the filter value and lowercases it for case-insensitive search.
   */
  private String normalizeFilter(String value) {
    String normalized = normalize(value);
    return normalized == null ? null : normalized.toLowerCase(Locale.ROOT);
  }

}

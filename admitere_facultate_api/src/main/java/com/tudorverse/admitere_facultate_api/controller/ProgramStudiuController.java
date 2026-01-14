package com.tudorverse.admitere_facultate_api.controller;

import com.tudorverse.admitere_facultate_api.dto.ProgramStudiuResponse;
import com.tudorverse.admitere_facultate_api.model.ProgramStudiu;
import com.tudorverse.admitere_facultate_api.repository.ProgramStudiuRepository;
import java.util.List;
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
 * Endpoint-uri CRUD pentru tabela program_studiu.
 */
@RestController
@RequestMapping("/api/admin/programe-studiu")
public class ProgramStudiuController {

  private final ProgramStudiuRepository programStudiuRepository;

  public ProgramStudiuController(ProgramStudiuRepository programStudiuRepository) {
    this.programStudiuRepository = programStudiuRepository;
  }

  @GetMapping
  public List<ProgramStudiuResponse> list(
      @RequestParam(required = false) Integer locuriBugetMin,
      @RequestParam(required = false) Integer locuriBugetMax,
      @RequestParam(required = false) Integer locuriTaxaMin,
      @RequestParam(required = false) Integer locuriTaxaMax) {
    if (locuriBugetMin == null && locuriBugetMax == null
        && locuriTaxaMin == null && locuriTaxaMax == null) {
      return programStudiuRepository.findAllWithFacultate();
    }
    return programStudiuRepository.searchByLocuri(
        locuriBugetMin, locuriBugetMax, locuriTaxaMin, locuriTaxaMax);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ProgramStudiu create(@RequestBody ProgramStudiu program) {
    if (program == null || program.getFacultateId() == null || isBlank(program.getNume())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date incomplete");
    }
    ProgramStudiu payload = new ProgramStudiu();
    payload.setFacultateId(program.getFacultateId());
    payload.setNume(program.getNume().trim());
    payload.setLocuriBuget(program.getLocuriBuget());
    payload.setLocuriTaxa(program.getLocuriTaxa());
    return programStudiuRepository.save(payload);
  }

  @PutMapping("/{id}")
  public ProgramStudiu update(@PathVariable Long id, @RequestBody ProgramStudiu program) {
    ProgramStudiu existing = programStudiuRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Program inexistent"));
    if (program == null || program.getFacultateId() == null || isBlank(program.getNume())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date incomplete");
    }
    existing.setFacultateId(program.getFacultateId());
    existing.setNume(program.getNume().trim());
    existing.setLocuriBuget(program.getLocuriBuget());
    existing.setLocuriTaxa(program.getLocuriTaxa());
    return programStudiuRepository.save(existing);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    if (!programStudiuRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Program inexistent");
    }
    programStudiuRepository.deleteById(id);
  }

  private boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
  }
}

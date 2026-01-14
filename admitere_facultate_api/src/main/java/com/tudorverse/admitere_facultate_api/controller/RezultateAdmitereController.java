package com.tudorverse.admitere_facultate_api.controller;

import com.tudorverse.admitere_facultate_api.dto.RezultatAdmitereResponse;
import com.tudorverse.admitere_facultate_api.service.ProcesareAdmitereService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint-uri doar pentru citire pentru vizualizarea rezultatelor procesate.
 */
@RestController
@RequestMapping("/api/admin/rezultate")
public class RezultateAdmitereController {

  private final ProcesareAdmitereService procesareAdmitereService;

  public RezultateAdmitereController(ProcesareAdmitereService procesareAdmitereService) {
    this.procesareAdmitereService = procesareAdmitereService;
  }

  @GetMapping
  public List<RezultatAdmitereResponse> list() {
    return procesareAdmitereService.getUltimeleRezultate();
  }
}

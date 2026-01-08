package com.tudorverse.admitere_facultate_api.controller;

import com.tudorverse.admitere_facultate_api.dto.ProcesareAdmitereResponse;
import com.tudorverse.admitere_facultate_api.service.ProcesareAdmitereService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint for triggering admission processing from the admin dashboard.
 */
@RestController
@RequestMapping("/api/admin/procesare")
public class ProcesareAdmitereController {

  private final ProcesareAdmitereService procesareAdmitereService;

  public ProcesareAdmitereController(ProcesareAdmitereService procesareAdmitereService) {
    this.procesareAdmitereService = procesareAdmitereService;
  }

  @PostMapping
  public ProcesareAdmitereResponse proceseaza() {
    return procesareAdmitereService.proceseazaAdmitere();
  }
}

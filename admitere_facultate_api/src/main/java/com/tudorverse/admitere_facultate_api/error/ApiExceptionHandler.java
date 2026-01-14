package com.tudorverse.admitere_facultate_api.error;

import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Handler global de erori care normalizeaza incalcarile de constrangeri din DB.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

  // Normalizeaza incalcarile de constrangeri din baza de date intr-un mesaj prietenos.
  @ExceptionHandler(DataIntegrityViolationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> handleDataIntegrityViolation() {
    return Map.of("error", "Date invalide sau duplicate");
  }
}

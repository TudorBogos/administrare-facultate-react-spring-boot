package com.tudorverse.admitere_facultate_api.error;

import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global error handler that normalizes DB constraint failures.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

  // Normalize database constraint violations into a friendly message.
  @ExceptionHandler(DataIntegrityViolationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> handleDataIntegrityViolation() {
    return Map.of("error", "Date invalide sau duplicate");
  }
}

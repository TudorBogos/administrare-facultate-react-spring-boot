package com.tudorverse.admitere_facultate_api.auth;

import com.tudorverse.admitere_facultate_api.dto.AdminLoginRequest;
import com.tudorverse.admitere_facultate_api.dto.AdminResponse;
import com.tudorverse.admitere_facultate_api.model.Admin;
import com.tudorverse.admitere_facultate_api.repository.AdminRepository;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Authentication endpoints for admin login, logout, and session checks.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AdminRepository adminRepository;
  private final AdminSessionService sessionService;
  private final PasswordEncoder passwordEncoder;

  public AuthController(AdminRepository adminRepository, AdminSessionService sessionService,
      PasswordEncoder passwordEncoder) {
    this.adminRepository = adminRepository;
    this.sessionService = sessionService;
    this.passwordEncoder = passwordEncoder;
  }

  @PostMapping("/login")
  public ResponseEntity<AdminResponse> login(@RequestBody AdminLoginRequest request,
      HttpServletResponse response) {
    if (request == null || request.email() == null || request.parola() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date de autentificare lipsa");
    }

    String email = request.email().trim();
    if (email.isEmpty() || request.parola().isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date de autentificare lipsa");
    }

    Admin admin = adminRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
            "Credentiale invalide"));

    if (!passwordEncoder.matches(request.parola(), admin.getParolaHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credentiale invalide");
    }

    String sessionId = sessionService.createSession(admin.getId());
    // Set HttpOnly cookie with the server-side session id.
    ResponseCookie cookie = ResponseCookie.from(AdminAuthFilter.COOKIE_NAME, sessionId)
        .httpOnly(true)
        .path("/")
        .sameSite("Lax")
        .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    return ResponseEntity.ok(toResponse(admin));
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(
      @CookieValue(value = AdminAuthFilter.COOKIE_NAME, required = false) String sessionId,
      HttpServletResponse response) {
    // Remove session from memory and clear cookie.
    sessionService.invalidate(sessionId);
    ResponseCookie cookie = ResponseCookie.from(AdminAuthFilter.COOKIE_NAME, "")
        .httpOnly(true)
        .path("/")
        .sameSite("Lax")
        .maxAge(0)
        .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/me")
  public ResponseEntity<AdminResponse> me(
      @CookieValue(value = AdminAuthFilter.COOKIE_NAME, required = false) String sessionId) {
    // Lightweight session check for the dashboard.
    Optional<Long> adminId = sessionService.getAdminId(sessionId);
    if (adminId.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    Admin admin = adminRepository.findById(adminId.get())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    return ResponseEntity.ok(toResponse(admin));
  }

  private AdminResponse toResponse(Admin admin) {
    return new AdminResponse(admin.getId(), admin.getEmail(), admin.getCreatedAt());
  }
}

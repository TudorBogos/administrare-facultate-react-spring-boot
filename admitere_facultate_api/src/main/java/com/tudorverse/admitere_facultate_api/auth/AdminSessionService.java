package com.tudorverse.admitere_facultate_api.auth;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/**
 * Stoc de sesiuni in memorie pentru login/logout admin.
 */
@Service
public class AdminSessionService {

  // Stoc de sesiuni in memorie (se sterge la restart).
  private final Map<String, AdminSession> sessions = new ConcurrentHashMap<>();

  public String createSession(Long adminId) {
    String sessionId = UUID.randomUUID().toString();
    sessions.put(sessionId, new AdminSession(adminId, Instant.now()));
    return sessionId;
  }

  public Optional<Long> getAdminId(String sessionId) {
    if (sessionId == null || sessionId.isBlank()) {
      return Optional.empty();
    }
    AdminSession session = sessions.get(sessionId);
    if (session == null) {
      return Optional.empty();
    }
    return Optional.of(session.adminId());
  }

  public void invalidate(String sessionId) {
    if (sessionId != null && !sessionId.isBlank()) {
      sessions.remove(sessionId);
    }
  }
}

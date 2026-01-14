package com.tudorverse.admitere_facultate_api.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filtru servlet care protejeaza rutele /api/admin folosind un cookie de sesiune HttpOnly.
 */
@Component
public class AdminAuthFilter extends OncePerRequestFilter {

  public static final String COOKIE_NAME = "admin_session";

  private final AdminSessionService sessionService;

  public AdminAuthFilter(AdminSessionService sessionService) {
    this.sessionService = sessionService;
  }

  // Protejeaza doar endpoint-urile admin CRUD prin validarea sesiunii.
  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    return !request.getRequestURI().startsWith("/api/admin");
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    // Permite trecerea cererilor preflight CORS.
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
      filterChain.doFilter(request, response);
      return;
    }

    // Id-ul sesiunii este stocat intr-un cookie HttpOnly.
    String sessionId = null;
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if (COOKIE_NAME.equals(cookie.getName())) {
          sessionId = cookie.getValue();
          break;
        }
      }
    }

    if (sessionService.getAdminId(sessionId).isEmpty()) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      return;
    }

    filterChain.doFilter(request, response);
  }
}

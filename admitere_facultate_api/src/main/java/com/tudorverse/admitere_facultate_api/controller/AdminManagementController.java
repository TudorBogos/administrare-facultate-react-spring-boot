package com.tudorverse.admitere_facultate_api.controller;

import com.tudorverse.admitere_facultate_api.dto.AdminCreateRequest;
import com.tudorverse.admitere_facultate_api.dto.AdminResponse;
import com.tudorverse.admitere_facultate_api.dto.AdminUpdateRequest;
import com.tudorverse.admitere_facultate_api.model.Admin;
import com.tudorverse.admitere_facultate_api.repository.AdminRepository;
import java.util.List;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Endpoint-uri CRUD pentru administrarea conturilor de admin.
 */
@RestController
@RequestMapping("/api/admin/admini")
public class AdminManagementController {

  private final AdminRepository adminRepository;
  private final PasswordEncoder passwordEncoder;

  public AdminManagementController(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
    this.adminRepository = adminRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @GetMapping
  public List<AdminResponse> list() {
    return adminRepository.findAll(Sort.by("id")).stream()
        .map(this::toResponse)
        .toList();
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public AdminResponse create(@RequestBody AdminCreateRequest request) {
    if (request == null || isBlank(request.email()) || isBlank(request.parola())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email si parola sunt necesare");
    }
    Admin admin = new Admin();
    admin.setEmail(request.email().trim());
    admin.setParolaHash(passwordEncoder.encode(request.parola()));
    return toResponse(adminRepository.save(admin));
  }

  @PutMapping("/{id}")
  public AdminResponse update(@PathVariable Long id, @RequestBody AdminUpdateRequest request) {
    Admin admin = adminRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin inexistent"));

    if (request != null) {
      if (!isBlank(request.email())) {
        admin.setEmail(request.email().trim());
      }
      if (!isBlank(request.parola())) {
        admin.setParolaHash(passwordEncoder.encode(request.parola()));
      }
    }

    return toResponse(adminRepository.save(admin));
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    if (!adminRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin inexistent");
    }
    adminRepository.deleteById(id);
  }

  private AdminResponse toResponse(Admin admin) {
    return new AdminResponse(admin.getId(), admin.getEmail(), admin.getCreatedAt());
  }

  private boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
  }
}

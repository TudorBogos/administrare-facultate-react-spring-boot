package com.tudorverse.admitere_facultate_api.repository;

import com.tudorverse.admitere_facultate_api.model.Admin;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository Spring Data pentru entitati admin.
 */
public interface AdminRepository extends JpaRepository<Admin, Long> {
  Optional<Admin> findByEmail(String email);
}

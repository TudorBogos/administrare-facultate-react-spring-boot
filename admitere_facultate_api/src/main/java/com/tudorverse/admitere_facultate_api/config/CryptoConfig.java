package com.tudorverse.admitere_facultate_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configurare Spring pentru utilitare de hash-uire a parolelor.
 */
@Configuration
public class CryptoConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    // BCrypt mentine hash-urile lente pentru atacuri brute-force.
    return new BCryptPasswordEncoder();
  }
}

package com.tudorverse.admitere_facultate_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Spring configuration for password hashing utilities.
 */
@Configuration
public class CryptoConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    // BCrypt keeps stored hashes slow to brute-force.
    return new BCryptPasswordEncoder();
  }
}

package com.tudorverse.admitere_facultate_api.auth;

import java.time.Instant;

/**
 * Obiect valoare imutabil care reprezinta o sesiune de admin in memorie.
 */
public record AdminSession(Long adminId, Instant createdAt) {
}

package com.tudorverse.admitere_facultate_api.auth;

import java.time.Instant;

/**
 * Immutable value object representing an admin session in memory.
 */
public record AdminSession(Long adminId, Instant createdAt) {
}

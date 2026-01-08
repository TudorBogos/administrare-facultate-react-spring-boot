package com.tudorverse.admitere_facultate_api.dto;

import java.time.OffsetDateTime;

/**
 * Response payload sent back for admin data.
 */
public record AdminResponse(Long id, String email, OffsetDateTime createdAt) {
}

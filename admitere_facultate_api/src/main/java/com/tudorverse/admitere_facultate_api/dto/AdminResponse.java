package com.tudorverse.admitere_facultate_api.dto;

import java.time.OffsetDateTime;

/**
 * Payload de raspuns pentru datele admin.
 */
public record AdminResponse(Long id, String email, OffsetDateTime createdAt) {
}

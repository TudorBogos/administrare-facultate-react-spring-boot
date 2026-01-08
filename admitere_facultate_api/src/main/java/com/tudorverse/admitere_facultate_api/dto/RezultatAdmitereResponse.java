package com.tudorverse.admitere_facultate_api.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * API response describing a processed admission result.
 */
public record RezultatAdmitereResponse(Long dosarId, Long candidatId, String candidatNume,
    String candidatPrenume, BigDecimal medie, OffsetDateTime createdAt,
    Integer prioritate, String status, Long programId, String programNume,
    String facultateNume) {
}

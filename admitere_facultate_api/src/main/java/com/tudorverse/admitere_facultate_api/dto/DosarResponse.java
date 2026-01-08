package com.tudorverse.admitere_facultate_api.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * Response payload for dosar rows including candidate name details.
 */
public record DosarResponse(Long id, Long candidatId, String candidatNume,
    String candidatPrenume, String status, BigDecimal medie, OffsetDateTime createdAt) {
}

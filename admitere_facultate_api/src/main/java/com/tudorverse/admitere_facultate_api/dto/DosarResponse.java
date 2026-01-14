package com.tudorverse.admitere_facultate_api.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * Payload de raspuns pentru dosare, inclusiv numele candidatului.
 */
public record DosarResponse(Long id, Long candidatId, String candidatNume,
    String candidatPrenume, String status, BigDecimal medie, OffsetDateTime createdAt) {
}

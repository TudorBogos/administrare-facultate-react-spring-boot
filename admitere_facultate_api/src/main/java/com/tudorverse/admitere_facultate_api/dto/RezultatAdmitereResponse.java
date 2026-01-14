package com.tudorverse.admitere_facultate_api.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * Raspuns API care descrie un rezultat de admitere procesat.
 */
public record RezultatAdmitereResponse(Long dosarId, Long candidatId, String candidatNume,
    String candidatPrenume, BigDecimal medie, OffsetDateTime createdAt,
    Integer prioritate, String status, Long programId, String programNume,
    String facultateNume) {
}

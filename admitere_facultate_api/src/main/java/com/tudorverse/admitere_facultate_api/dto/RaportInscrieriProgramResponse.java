package com.tudorverse.admitere_facultate_api.dto;

/**
 * Rand de raport cu numarul de studenti admisi pe program de studiu.
 */
public record RaportInscrieriProgramResponse(Long programId, String programNume,
    String facultateNume, int inscrisi) {
}

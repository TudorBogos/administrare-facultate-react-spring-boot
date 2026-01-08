package com.tudorverse.admitere_facultate_api.dto;

/**
 * Report row with the number of admitted students per study program.
 */
public record RaportInscrieriProgramResponse(Long programId, String programNume,
    String facultateNume, int inscrisi) {
}

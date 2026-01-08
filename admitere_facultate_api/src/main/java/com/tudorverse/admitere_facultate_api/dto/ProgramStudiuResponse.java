package com.tudorverse.admitere_facultate_api.dto;

/**
 * Response payload that includes the faculty name for a study program.
 */
public record ProgramStudiuResponse(Long id, Long facultateId, String facultateNume, String nume,
    int locuriBuget, int locuriTaxa) {
}

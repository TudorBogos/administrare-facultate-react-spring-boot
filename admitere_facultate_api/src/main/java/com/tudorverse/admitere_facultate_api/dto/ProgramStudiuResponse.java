package com.tudorverse.admitere_facultate_api.dto;

/**
 * Payload de raspuns care include numele facultatii pentru un program de studiu.
 */
public record ProgramStudiuResponse(Long id, Long facultateId, String facultateNume, String nume,
    int locuriBuget, int locuriTaxa) {
}

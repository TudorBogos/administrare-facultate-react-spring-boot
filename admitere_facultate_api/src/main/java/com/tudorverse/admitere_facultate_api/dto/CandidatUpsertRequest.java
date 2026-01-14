package com.tudorverse.admitere_facultate_api.dto;

/**
 * Payload de cerere pentru crearea sau actualizarea unui candidat.
 */
public record CandidatUpsertRequest(String nume, String prenume, String email, String parola) {
}

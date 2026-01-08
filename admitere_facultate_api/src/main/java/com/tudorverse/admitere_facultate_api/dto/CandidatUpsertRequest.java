package com.tudorverse.admitere_facultate_api.dto;

/**
 * Request payload for creating or updating a candidat.
 */
public record CandidatUpsertRequest(String nume, String prenume, String email, String parola) {
}

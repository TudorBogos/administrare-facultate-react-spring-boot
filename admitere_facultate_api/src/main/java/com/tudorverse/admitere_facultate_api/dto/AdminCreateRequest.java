package com.tudorverse.admitere_facultate_api.dto;

/**
 * Payload de cerere pentru crearea unui admin.
 */
public record AdminCreateRequest(String email, String parola) {
}

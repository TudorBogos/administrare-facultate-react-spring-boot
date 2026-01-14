package com.tudorverse.admitere_facultate_api.dto;

/**
 * Payload de cerere pentru actualizarea unui admin.
 */
public record AdminUpdateRequest(String email, String parola) {
}

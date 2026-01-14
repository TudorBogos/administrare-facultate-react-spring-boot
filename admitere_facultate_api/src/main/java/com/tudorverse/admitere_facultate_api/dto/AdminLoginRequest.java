package com.tudorverse.admitere_facultate_api.dto;

/**
 * Payload de cerere pentru autentificarea admin.
 */
public record AdminLoginRequest(String email, String parola) {
}

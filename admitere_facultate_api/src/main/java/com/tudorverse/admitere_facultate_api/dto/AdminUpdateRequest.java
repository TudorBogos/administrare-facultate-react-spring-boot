package com.tudorverse.admitere_facultate_api.dto;

/**
 * Request payload for updating an admin.
 */
public record AdminUpdateRequest(String email, String parola) {
}

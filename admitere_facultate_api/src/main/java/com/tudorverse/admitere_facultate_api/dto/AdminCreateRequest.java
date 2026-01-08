package com.tudorverse.admitere_facultate_api.dto;

/**
 * Request payload for creating an admin.
 */
public record AdminCreateRequest(String email, String parola) {
}

package com.tudorverse.admitere_facultate_api.dto;

/**
 * Request payload for admin login.
 */
public record AdminLoginRequest(String email, String parola) {
}

package com.tudorverse.admitere_facultate_api.dto;

/**
 * Rezumatul rezultatelor procesarii admiterii returnat la declansare de admin.
 */
public record ProcesareAdmitereResponse(int dosareProcesate, int dosareAdmise,
    int dosareNealocate) {
}

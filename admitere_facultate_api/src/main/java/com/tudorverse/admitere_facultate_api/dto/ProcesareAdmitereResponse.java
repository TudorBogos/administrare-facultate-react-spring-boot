package com.tudorverse.admitere_facultate_api.dto;

/**
 * Summary of the admission processing results returned to the admin trigger.
 */
public record ProcesareAdmitereResponse(int dosareProcesate, int dosareAdmise,
    int dosareNealocate) {
}

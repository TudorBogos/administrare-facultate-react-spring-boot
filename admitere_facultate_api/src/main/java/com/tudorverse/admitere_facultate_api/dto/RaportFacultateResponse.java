package com.tudorverse.admitere_facultate_api.dto;

/**
 * Rand de raport cu numarul de admisi/respinsi pe facultate.
 */
public record RaportFacultateResponse(String facultateNume, int admisi, int respinsi) {
}

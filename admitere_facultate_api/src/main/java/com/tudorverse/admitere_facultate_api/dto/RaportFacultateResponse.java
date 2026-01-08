package com.tudorverse.admitere_facultate_api.dto;

/**
 * Report row with admitted/rejected counts per faculty.
 */
public record RaportFacultateResponse(String facultateNume, int admisi, int respinsi) {
}

package com.tudorverse.admitere_facultate_api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * JPA entity mapping to the program_studiu table.
 */
@Entity
@Table(name = "program_studiu")
public class ProgramStudiu {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "facultate_id", nullable = false)
  private Long facultateId;

  @Column(nullable = false)
  private String nume;

  @Column(name = "locuri_buget", nullable = false)
  private int locuriBuget;

  @Column(name = "locuri_taxa", nullable = false)
  private int locuriTaxa;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getFacultateId() {
    return facultateId;
  }

  public void setFacultateId(Long facultateId) {
    this.facultateId = facultateId;
  }

  public String getNume() {
    return nume;
  }

  public void setNume(String nume) {
    this.nume = nume;
  }

  public int getLocuriBuget() {
    return locuriBuget;
  }

  public void setLocuriBuget(int locuriBuget) {
    this.locuriBuget = locuriBuget;
  }

  public int getLocuriTaxa() {
    return locuriTaxa;
  }

  public void setLocuriTaxa(int locuriTaxa) {
    this.locuriTaxa = locuriTaxa;
  }
}

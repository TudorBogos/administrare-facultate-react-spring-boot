package com.tudorverse.admitere_facultate_api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * JPA entity mapping to the candidat table.
 */
@Entity
@Table(name = "candidat")
public class Candidat {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String nume;

  @Column(nullable = false)
  private String prenume;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(name = "parola_hash")
  private String parolaHash;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getNume() {
    return nume;
  }

  public void setNume(String nume) {
    this.nume = nume;
  }

  public String getPrenume() {
    return prenume;
  }

  public void setPrenume(String prenume) {
    this.prenume = prenume;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getParolaHash() {
    return parolaHash;
  }

  public void setParolaHash(String parolaHash) {
    this.parolaHash = parolaHash;
  }
}

package com.tudorverse.admitere_facultate_api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Entitate JPA mapata la tabela optiune.
 */
@Entity
@Table(name = "optiune")
public class Optiune {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "dosar_id", nullable = false)
  private Long dosarId;

  @Column(name = "program_id", nullable = false)
  private Long programId;

  @Column(nullable = false)
  private int prioritate;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getDosarId() {
    return dosarId;
  }

  public void setDosarId(Long dosarId) {
    this.dosarId = dosarId;
  }

  public Long getProgramId() {
    return programId;
  }

  public void setProgramId(Long programId) {
    this.programId = programId;
  }

  public int getPrioritate() {
    return prioritate;
  }

  public void setPrioritate(int prioritate) {
    this.prioritate = prioritate;
  }

}

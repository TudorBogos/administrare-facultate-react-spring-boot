package com.tudorverse.admitere_facultate_api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * JPA entity mapping to the dosar table.
 */
@Entity
@Table(name = "dosar")
public class Dosar {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "candidat_id", nullable = false)
  private Long candidatId;

  @Column(nullable = false)
  private String status;

  @Column(precision = 4, scale = 2)
  private BigDecimal medie;

  @Column(name = "created_at", nullable = false)
  private OffsetDateTime createdAt;

  @PrePersist
  void onCreate() {
    if (createdAt == null) {
      createdAt = OffsetDateTime.now();
    }
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getCandidatId() {
    return candidatId;
  }

  public void setCandidatId(Long candidatId) {
    this.candidatId = candidatId;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public BigDecimal getMedie() {
    return medie;
  }

  public void setMedie(BigDecimal medie) {
    this.medie = medie;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(OffsetDateTime createdAt) {
    this.createdAt = createdAt;
  }

}

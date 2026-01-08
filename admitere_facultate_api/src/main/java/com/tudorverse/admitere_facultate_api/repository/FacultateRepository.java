package com.tudorverse.admitere_facultate_api.repository;

import com.tudorverse.admitere_facultate_api.model.Facultate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data repository for facultate entities.
 */
public interface FacultateRepository extends JpaRepository<Facultate, Long> {

  List<Facultate> findByNumeContainingIgnoreCaseOrderByNumeAsc(String nume);
}

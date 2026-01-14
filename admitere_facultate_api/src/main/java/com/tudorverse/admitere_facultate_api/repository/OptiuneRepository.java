package com.tudorverse.admitere_facultate_api.repository;

import com.tudorverse.admitere_facultate_api.model.Optiune;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository Spring Data pentru entitati optiune.
 */
public interface OptiuneRepository extends JpaRepository<Optiune, Long> {

  List<Optiune> findByDosarIdInOrderByDosarIdAscPrioritateAsc(List<Long> dosarIds);
}

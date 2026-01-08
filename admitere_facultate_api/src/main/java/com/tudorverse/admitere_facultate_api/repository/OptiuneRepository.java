package com.tudorverse.admitere_facultate_api.repository;

import com.tudorverse.admitere_facultate_api.model.Optiune;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data repository for optiune entities.
 */
public interface OptiuneRepository extends JpaRepository<Optiune, Long> {

  List<Optiune> findByDosarIdInOrderByDosarIdAscPrioritateAsc(List<Long> dosarIds);
}

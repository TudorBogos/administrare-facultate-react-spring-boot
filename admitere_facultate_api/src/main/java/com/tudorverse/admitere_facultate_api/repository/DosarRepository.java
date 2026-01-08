package com.tudorverse.admitere_facultate_api.repository;

import com.tudorverse.admitere_facultate_api.dto.DosarResponse;
import com.tudorverse.admitere_facultate_api.model.Dosar;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Spring Data repository for dosar entities.
 */
public interface DosarRepository extends JpaRepository<Dosar, Long> {

  List<Dosar> findByStatus(String status);

  List<Dosar> findByStatusAndMedieIsNotNull(String status);

  @Query("""
      select new com.tudorverse.admitere_facultate_api.dto.DosarResponse(
        d.id, d.candidatId, c.nume, c.prenume, d.status, d.medie, d.createdAt)
      from Dosar d, Candidat c
      where d.candidatId = c.id
      order by d.id
      """)
  List<DosarResponse> findAllWithCandidat();

}

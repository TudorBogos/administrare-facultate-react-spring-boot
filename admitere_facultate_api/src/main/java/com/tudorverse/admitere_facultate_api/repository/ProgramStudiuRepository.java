package com.tudorverse.admitere_facultate_api.repository;

import com.tudorverse.admitere_facultate_api.dto.ProgramStudiuResponse;
import com.tudorverse.admitere_facultate_api.model.ProgramStudiu;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Spring Data repository for program_studiu entities.
 */
public interface ProgramStudiuRepository extends JpaRepository<ProgramStudiu, Long> {

  @Query("""
      select new com.tudorverse.admitere_facultate_api.dto.ProgramStudiuResponse(
        p.id, p.facultateId, f.nume, p.nume, p.locuriBuget, p.locuriTaxa)
      from ProgramStudiu p, Facultate f
      where f.id = p.facultateId
      order by p.id
      """)
  List<ProgramStudiuResponse> findAllWithFacultate();

  @Query("""
      select new com.tudorverse.admitere_facultate_api.dto.ProgramStudiuResponse(
        p.id, p.facultateId, f.nume, p.nume, p.locuriBuget, p.locuriTaxa)
      from ProgramStudiu p, Facultate f
      where f.id = p.facultateId
        and (:bugetMin is null or p.locuriBuget >= :bugetMin)
        and (:bugetMax is null or p.locuriBuget <= :bugetMax)
        and (:taxaMin is null or p.locuriTaxa >= :taxaMin)
        and (:taxaMax is null or p.locuriTaxa <= :taxaMax)
      order by p.id
      """)
  List<ProgramStudiuResponse> searchByLocuri(@Param("bugetMin") Integer bugetMin,
      @Param("bugetMax") Integer bugetMax,
      @Param("taxaMin") Integer taxaMin,
      @Param("taxaMax") Integer taxaMax);
}

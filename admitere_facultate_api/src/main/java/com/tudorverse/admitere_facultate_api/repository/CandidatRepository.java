package com.tudorverse.admitere_facultate_api.repository;

import com.tudorverse.admitere_facultate_api.model.Candidat;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Repository Spring Data pentru entitati candidat, cu functii de cautare.
 */
public interface CandidatRepository extends JpaRepository<Candidat, Long> {

  @Query("""
      select c from Candidat c
      where lower(c.nume) like concat('%', :nume, '%')
        and lower(c.prenume) like concat('%', :prenume, '%')
        and lower(c.email) like concat('%', :email, '%')
      order by c.id
      """)
  List<Candidat> search(@Param("nume") String nume, @Param("prenume") String prenume,
      @Param("email") String email);
}

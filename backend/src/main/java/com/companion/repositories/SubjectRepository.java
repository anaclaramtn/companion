package com.companion.repositories;

import com.companion.entities.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    boolean existsByUniversityIdAndCodeIgnoreCase(Long universityId, String code);
    boolean existsByUniversityIdAndCodeIgnoreCaseAndIdNot(Long universityId, String code, Long id);
    Optional<Subject> findByUniversityIdAndCodeIgnoreCase(Long universityId, String code);

    // Busca por nome ou código; sem texto, devolve todas.
    @Query("""
            select s from Subject s
            where :query is null
               or lower(s.name) like lower(concat('%', :query, '%'))
               or lower(s.code) like lower(concat('%', :query, '%'))
            order by s.name
            """)
    List<Subject> search(@Param("query") String query);
}

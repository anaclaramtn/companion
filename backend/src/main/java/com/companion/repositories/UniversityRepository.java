package com.companion.repositories;

import com.companion.entities.University;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UniversityRepository extends JpaRepository<University, Long> {
    List<University> findAllByOrderByNameAsc();
    Optional<University> findByAcronymIgnoreCase(String acronym);
}

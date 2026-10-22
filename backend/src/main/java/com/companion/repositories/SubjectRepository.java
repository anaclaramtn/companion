package com.companion.repositories;

import com.companion.entities.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
    List<Subject> findAllByOrderByNameAsc();
    Page<Subject> findByNameContainingIgnoreCaseOrderByNameAsc(String query, Pageable pageable);
}

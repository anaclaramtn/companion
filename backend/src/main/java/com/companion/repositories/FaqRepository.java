package com.companion.repositories;

import com.companion.entities.Faq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findByActiveTrueOrderByDisplayOrderAscIdAsc();
    Optional<Faq> findByIdAndActiveTrue(Long id);
    Page<Faq> findAllByOrderByDisplayOrderAscIdAsc(Pageable pageable);
}

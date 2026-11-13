package com.companion.repositories;

import com.companion.entities.UserSubject;
import com.companion.enums.SubjectInterestType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserSubjectRepository extends JpaRepository<UserSubject, Long> {
    @EntityGraph(attributePaths = "subject")
    List<UserSubject> findByUserIdOrderBySubjectNameAsc(Long userId);

    @EntityGraph(attributePaths = "subject")
    List<UserSubject> findByUserIdInAndInterestTypeOrderBySubjectNameAsc(
            Collection<Long> userIds, SubjectInterestType interestType);

    @EntityGraph(attributePaths = {"user", "subject"})
    Optional<UserSubject> findByUserIdAndSubjectId(Long userId, Long subjectId);

    boolean existsByUserIdAndSubjectId(Long userId, Long subjectId);
    boolean existsBySubjectId(Long subjectId);
    void deleteByUserIdAndSubjectId(Long userId, Long subjectId);
}

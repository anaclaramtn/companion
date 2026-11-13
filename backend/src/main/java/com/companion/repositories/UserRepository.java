package com.companion.repositories;

import com.companion.entities.User;
import com.companion.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByUsernameIgnoreCase(String username);

    Optional<User> findByEmailIgnoreCaseOrUsernameIgnoreCase(String email, String username);

    Optional<User> findByIdAndStatusNot(Long id, UserStatus status);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByUsernameIgnoreCaseAndIdNot(String username, Long id);

    boolean existsByRegistrationNumberIgnoreCase(String registrationNumber);

    boolean existsByRegistrationNumberIgnoreCaseAndIdNot(String registrationNumber, Long id);

    /**
     * Busca estudantes por nome, username ou matéria que dominam (matérias
     * em que só querem aprender não contam). Com subjectId, só quem domina a matéria.
     */
    @Query("""
            select u from User u
            where u.status = com.companion.enums.UserStatus.ACTIVE
              and u.username is not null
              and (
                :subjectId is null
                or exists (
                  select 1 from UserSubject us
                  where us.user = u
                    and us.subject.id = :subjectId
                    and us.interestType = com.companion.enums.SubjectInterestType.DOMINA
                )
              )
              and (
                :query is null
                or lower(u.name) like lower(concat('%', :query, '%'))
                or lower(u.username) like lower(concat('%', :query, '%'))
                or exists (
                  select 1 from UserSubject us2
                  where us2.user = u
                    and us2.interestType = com.companion.enums.SubjectInterestType.DOMINA
                    and lower(us2.subject.name) like lower(concat('%', :query, '%'))
                )
              )
            """)
    Page<User> searchPublic(@Param("query") String query, @Param("subjectId") Long subjectId, Pageable pageable);

    @Query("""
            select u from User u
            where :query is null
               or lower(u.email) like lower(concat('%', :query, '%'))
               or lower(coalesce(u.name, '')) like lower(concat('%', :query, '%'))
               or lower(coalesce(u.username, '')) like lower(concat('%', :query, '%'))
            """)
    Page<User> searchAdmin(@Param("query") String query, Pageable pageable);
}

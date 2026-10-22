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

    @Query("""
            select distinct u from User u
            left join UserSubject us on us.user = u
            left join us.subject s
            where u.status = com.companion.enums.UserStatus.ACTIVE
              and u.username is not null
              and (
                :query is null
                or lower(u.name) like lower(concat('%', :query, '%'))
                or lower(u.username) like lower(concat('%', :query, '%'))
                or lower(coalesce(u.bio, '')) like lower(concat('%', :query, '%'))
                or lower(coalesce(s.name, '')) like lower(concat('%', :query, '%'))
              )
            """)
    Page<User> searchPublic(@Param("query") String query, Pageable pageable);

    @Query("""
            select u from User u
            where :query is null
               or lower(u.email) like lower(concat('%', :query, '%'))
               or lower(coalesce(u.name, '')) like lower(concat('%', :query, '%'))
               or lower(coalesce(u.username, '')) like lower(concat('%', :query, '%'))
            """)
    Page<User> searchAdmin(@Param("query") String query, Pageable pageable);
}

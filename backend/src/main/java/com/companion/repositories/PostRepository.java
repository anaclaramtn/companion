package com.companion.repositories;

import com.companion.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Collection;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    @EntityGraph(attributePaths = {"author", "subject"})
    Optional<Post> findByIdAndDeletedAtIsNull(Long id);

    @EntityGraph(attributePaths = {"author", "subject"})
    @Query("""
            select p from Post p
            where p.deletedAt is null
              and (:authorId is null or p.author.id = :authorId)
              and (:subjectId is null or p.subject.id = :subjectId)
              and (:query is null
                   or lower(p.title) like lower(concat('%', :query, '%'))
                   or lower(p.content) like lower(concat('%', :query, '%'))
                   or lower(p.subject.name) like lower(concat('%', :query, '%')))
            """)
    Page<Post> searchActive(@Param("query") String query,
                            @Param("subjectId") Long subjectId,
                            @Param("authorId") Long authorId,
                            Pageable pageable);

    boolean existsBySubjectId(Long subjectId);
    long countByAuthorIdAndDeletedAtIsNull(Long authorId);

    @Query("""
            select p.author.id as userId, count(p) as total
            from Post p where p.deletedAt is null and p.author.id in :userIds
            group by p.author.id
            """)
    List<UserCountProjection> countActiveByAuthorIds(@Param("userIds") Collection<Long> userIds);
}

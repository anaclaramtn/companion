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
    @EntityGraph(attributePaths = {"author"})
    Optional<Post> findByIdAndDeletedAtIsNull(Long id);

    // As disciplinas ficam em post_subjects; os filtros usam subconsultas para
    // não repetir o post quando ele tem mais de uma disciplina.
    @EntityGraph(attributePaths = {"author"})
    @Query("""
            select p from Post p
            where p.deletedAt is null
              and (:authorId is null or p.author.id = :authorId)
              and (:subjectId is null or exists (
                   select 1 from Post sp join sp.subjects s
                   where sp = p and s.id = :subjectId))
              and (:query is null
                   or lower(p.title) like lower(concat('%', :query, '%'))
                   or lower(p.content) like lower(concat('%', :query, '%'))
                   or exists (
                       select 1 from Post qp join qp.subjects qs
                       where qp = p
                         and (lower(qs.name) like lower(concat('%', :query, '%'))
                              or lower(qs.code) like lower(concat('%', :query, '%')))))
            """)
    Page<Post> searchActive(@Param("query") String query,
                            @Param("subjectId") Long subjectId,
                            @Param("authorId") Long authorId,
                            Pageable pageable);

    boolean existsBySubjectsId(Long subjectId);
    long countByAuthorIdAndDeletedAtIsNull(Long authorId);

    @Query("""
            select p.author.id as userId, count(p) as total
            from Post p where p.deletedAt is null and p.author.id in :userIds
            group by p.author.id
            """)
    List<UserCountProjection> countActiveByAuthorIds(@Param("userIds") Collection<Long> userIds);
}

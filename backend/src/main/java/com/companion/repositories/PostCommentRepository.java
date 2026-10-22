package com.companion.repositories;

import com.companion.entities.PostComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
    @EntityGraph(attributePaths = {"author", "post"})
    Optional<PostComment> findByIdAndDeletedAtIsNull(Long id);

    @EntityGraph(attributePaths = {"author", "post"})
    List<PostComment> findByPostIdAndDeletedAtIsNullOrderByCreatedAtAsc(Long postId);

    @EntityGraph(attributePaths = {"author", "post", "post.subject"})
    Page<PostComment> findByAuthorIdAndDeletedAtIsNull(Long authorId, Pageable pageable);

    long countByPostIdAndDeletedAtIsNull(Long postId);
    long countByAuthorIdAndDeletedAtIsNull(Long authorId);

    @Query("""
            select pc.author.id as userId, count(pc) as total
            from PostComment pc
            where pc.deletedAt is null and pc.author.id in :userIds
            group by pc.author.id
            """)
    List<UserCountProjection> countActiveByAuthorIds(@Param("userIds") Collection<Long> userIds);

    @Query("""
            select pc.post.id as postId, count(pc) as total
            from PostComment pc
            where pc.deletedAt is null and pc.post.id in :postIds
            group by pc.post.id
            """)
    List<PostCountProjection> countActiveByPostIds(@Param("postIds") Collection<Long> postIds);
}

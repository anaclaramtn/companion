package com.companion.repositories;

import com.companion.entities.PostLike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByUserIdAndPostId(Long userId, Long postId);
    Optional<PostLike> findByUserIdAndPostId(Long userId, Long postId);
    long countByPostId(Long postId);

    @EntityGraph(attributePaths = {"post", "post.author", "post.subject"})
    Page<PostLike> findByUserIdAndPostDeletedAtIsNull(Long userId, Pageable pageable);

    @Query("""
            select pl.post.id as postId, count(pl) as total
            from PostLike pl where pl.post.id in :postIds group by pl.post.id
            """)
    List<PostCountProjection> countByPostIds(@Param("postIds") Collection<Long> postIds);

    @Query("select pl.post.id from PostLike pl where pl.user.id = :userId and pl.post.id in :postIds")
    List<Long> findLikedPostIds(@Param("userId") Long userId, @Param("postIds") Collection<Long> postIds);
}

package com.companion.repositories;

import com.companion.entities.PostSave;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PostSaveRepository extends JpaRepository<PostSave, Long> {
    boolean existsByUserIdAndPostId(Long userId, Long postId);
    Optional<PostSave> findByUserIdAndPostId(Long userId, Long postId);

    @EntityGraph(attributePaths = {"post", "post.author"})
    Page<PostSave> findByUserIdAndPostDeletedAtIsNull(Long userId, Pageable pageable);

    @Query("select ps.post.id from PostSave ps where ps.user.id = :userId and ps.post.id in :postIds")
    List<Long> findSavedPostIds(@Param("userId") Long userId, @Param("postIds") Collection<Long> postIds);
}

package com.companion.repositories;

import com.companion.entities.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Collection;
import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerIdAndFollowedId(Long followerId, Long followedId);
    Optional<Follow> findByFollowerIdAndFollowedId(Long followerId, Long followedId);
    @org.springframework.data.jpa.repository.Query("select count(f) from Follow f where f.followed.id = :followedId and f.follower.status = com.companion.enums.UserStatus.ACTIVE")
    long countByFollowedId(Long followedId);

    @org.springframework.data.jpa.repository.Query("select count(f) from Follow f where f.follower.id = :followerId and f.followed.status = com.companion.enums.UserStatus.ACTIVE")
    long countByFollowerId(Long followerId);

    @Query("""
            select f.followed.id as userId, count(f) as total
            from Follow f
            where f.followed.id in :userIds and f.follower.status = com.companion.enums.UserStatus.ACTIVE
            group by f.followed.id
            """)
    List<UserCountProjection> countFollowersForUsers(@Param("userIds") Collection<Long> userIds);

    @Query("""
            select f.follower.id as userId, count(f) as total
            from Follow f
            where f.follower.id in :userIds and f.followed.status = com.companion.enums.UserStatus.ACTIVE
            group by f.follower.id
            """)
    List<UserCountProjection> countFollowingForUsers(@Param("userIds") Collection<Long> userIds);

    @EntityGraph(attributePaths = "follower")
    Page<Follow> findByFollowedIdAndFollowerStatus(Long followedId, com.companion.enums.UserStatus status, Pageable pageable);

    @EntityGraph(attributePaths = "followed")
    Page<Follow> findByFollowerIdAndFollowedStatus(Long followerId, com.companion.enums.UserStatus status, Pageable pageable);
}

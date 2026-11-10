package com.companion.dtos.user;

import java.time.LocalDateTime;

public record UserPublicResponseDTO(
        Long id,
        String name,
        String username,
        String avatarUrl,
        String bio,
        Long courseId,
        String course,
        Long universityId,
        String university,
        Integer semester,
        long postCount,
        long commentCount,
        long followerCount,
        long followingCount,
        LocalDateTime createdAt
) {
}

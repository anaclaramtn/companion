package com.companion.dtos.user;

import com.companion.enums.UserRole;
import com.companion.enums.UserStatus;

import java.time.LocalDateTime;

public record UserAccountResponseDTO(
        Long id,
        String email,
        String name,
        String username,
        String avatarUrl,
        String bio,
        String registrationNumber,
        String course,
        Integer semester,
        UserRole role,
        UserStatus status,
        boolean profileComplete,
        LocalDateTime onboardingCompletedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}

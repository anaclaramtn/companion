package com.companion.dtos.user;

import com.companion.enums.UserRole;
import com.companion.enums.UserStatus;

import java.time.LocalDateTime;

public record UserAdminResponseDTO(
        Long id,
        String email,
        String name,
        String username,
        String registrationNumber,
        UserRole role,
        UserStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime deletedAt
) {
}

package com.companion.dtos.post;

import com.companion.dtos.subject.SubjectResponseDTO;
import com.companion.dtos.user.UserSummaryResponseDTO;

import java.time.LocalDateTime;

public record PostResponseDTO(
        Long id,
        UserSummaryResponseDTO author,
        SubjectResponseDTO subject,
        String title,
        String content,
        LocalDateTime createdAt,
        long likeCount,
        long commentCount,
        boolean likedByCurrentUser,
        boolean ownedByCurrentUser
) {
}

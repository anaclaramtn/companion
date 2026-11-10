package com.companion.dtos.post;

import com.companion.dtos.subject.SubjectResponseDTO;
import com.companion.dtos.user.UserSummaryResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

public record PostResponseDTO(
        Long id,
        UserSummaryResponseDTO author,
        List<SubjectResponseDTO> subjects,
        String title,
        String content,
        LocalDateTime createdAt,
        long likeCount,
        long commentCount,
        boolean likedByCurrentUser,
        boolean savedByCurrentUser,
        boolean ownedByCurrentUser
) {
}

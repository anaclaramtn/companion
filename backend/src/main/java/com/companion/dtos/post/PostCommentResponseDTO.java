package com.companion.dtos.post;

import com.companion.dtos.user.UserSummaryResponseDTO;

import java.time.LocalDateTime;

public record PostCommentResponseDTO(
        Long id,
        Long postId,
        String postTitle,
        UserSummaryResponseDTO author,
        String content,
        LocalDateTime createdAt,
        boolean ownedByCurrentUser
) {
}

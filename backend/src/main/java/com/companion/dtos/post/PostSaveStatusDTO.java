package com.companion.dtos.post;

public record PostSaveStatusDTO(Long postId, boolean savedByCurrentUser) {
}

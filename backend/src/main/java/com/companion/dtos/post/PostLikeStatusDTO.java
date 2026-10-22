package com.companion.dtos.post;

public record PostLikeStatusDTO(Long postId, long likeCount, boolean likedByCurrentUser) {
}

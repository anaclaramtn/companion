package com.companion.dtos.follow;

public record FollowStatusDTO(Long userId, boolean followedByCurrentUser, long followerCount, long followingCount) {
}

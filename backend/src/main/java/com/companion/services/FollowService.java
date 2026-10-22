package com.companion.services;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.follow.FollowStatusDTO;
import com.companion.dtos.user.UserSummaryResponseDTO;
import com.companion.entities.Follow;
import com.companion.entities.User;
import com.companion.enums.UserStatus;
import com.companion.exceptions.BadRequestException;
import com.companion.exceptions.ConflictException;
import com.companion.repositories.FollowRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FollowService {
    private final FollowRepository repository;
    private final UserService userService;
    private final AuthenticatedUserService authenticatedUserService;

    public FollowService(FollowRepository repository, UserService userService,
                         AuthenticatedUserService authenticatedUserService) {
        this.repository = repository; this.userService = userService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public FollowStatusDTO follow(Long targetId) {
        User follower = authenticatedUserService.getCurrentUserWithCompleteProfile();
        if (follower.getId().equals(targetId)) throw new BadRequestException("Não é possível seguir a si mesmo");
        User followed = userService.findVisibleUser(targetId);
        if (followed.getStatus() != UserStatus.ACTIVE) {
            throw new ConflictException("Não é possível seguir uma conta que não está ativa");
        }
        if (repository.existsByFollowerIdAndFollowedId(follower.getId(), targetId)) {
            throw new ConflictException("Este usuário já é seguido");
        }
        repository.saveAndFlush(new Follow(follower, followed));
        return status(targetId, follower.getId());
    }

    @Transactional
    public void unfollow(Long targetId) {
        Long followerId = authenticatedUserService.getCurrentUserWithCompleteProfile().getId();
        repository.findByFollowerIdAndFollowedId(followerId, targetId).ifPresent(repository::delete);
    }

    @Transactional(readOnly = true)
    public FollowStatusDTO status(Long targetId) {
        Long currentId = authenticatedUserService.getCurrentUserWithCompleteProfile().getId();
        userService.findVisibleUser(targetId);
        return status(targetId, currentId);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserSummaryResponseDTO> followers(Long userId, int page, int size) {
        authenticatedUserService.getCurrentUserWithCompleteProfile();
        userService.findVisibleUser(userId);
        Page<UserSummaryResponseDTO> result = repository.findByFollowedIdAndFollowerStatus(
                        userId, UserStatus.ACTIVE, PageRequest.of(page, Math.min(size, 50)))
                .map(Follow::getFollower).map(userService::toSummary);
        return PageResponse.from(result);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserSummaryResponseDTO> following(Long userId, int page, int size) {
        authenticatedUserService.getCurrentUserWithCompleteProfile();
        userService.findVisibleUser(userId);
        Page<UserSummaryResponseDTO> result = repository.findByFollowerIdAndFollowedStatus(
                        userId, UserStatus.ACTIVE, PageRequest.of(page, Math.min(size, 50)))
                .map(Follow::getFollowed).map(userService::toSummary);
        return PageResponse.from(result);
    }

    private FollowStatusDTO status(Long targetId, Long currentId) {
        return new FollowStatusDTO(targetId, repository.existsByFollowerIdAndFollowedId(currentId, targetId),
                repository.countByFollowedId(targetId), repository.countByFollowerId(targetId));
    }
}

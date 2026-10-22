package com.companion.services;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.post.PostLikeStatusDTO;
import com.companion.dtos.post.PostResponseDTO;
import com.companion.entities.Post;
import com.companion.entities.PostLike;
import com.companion.entities.User;
import com.companion.exceptions.ConflictException;
import com.companion.repositories.PostLikeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostLikeService {
    private final PostLikeRepository repository;
    private final PostService postService;
    private final AuthenticatedUserService authenticatedUserService;

    public PostLikeService(PostLikeRepository repository, PostService postService,
                           AuthenticatedUserService authenticatedUserService) {
        this.repository = repository; this.postService = postService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public PostLikeStatusDTO like(Long postId) {
        User user = authenticatedUserService.getCurrentUserWithCompleteProfile();
        Post post = postService.findActive(postId);
        if (repository.existsByUserIdAndPostId(user.getId(), postId)) {
            throw new ConflictException("O post já foi curtido por este usuário");
        }
        repository.saveAndFlush(new PostLike(user, post));
        return status(postId, user.getId());
    }

    @Transactional
    public void unlike(Long postId) {
        User user = authenticatedUserService.getCurrentUserWithCompleteProfile();
        postService.findActive(postId);
        repository.findByUserIdAndPostId(user.getId(), postId).ifPresent(repository::delete);
    }

    @Transactional(readOnly = true)
    public PostLikeStatusDTO status(Long postId) {
        Long userId = authenticatedUserService.getCurrentUserWithCompleteProfile().getId();
        postService.findActive(postId);
        return status(postId, userId);
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponseDTO> likedPosts(int page, int size) {
        Long viewerId = authenticatedUserService.getCurrentUserWithCompleteProfile().getId();
        Page<Post> posts = repository.findByUserIdAndPostDeletedAtIsNull(viewerId,
                        PageRequest.of(page, Math.min(size, 50), Sort.by("createdAt").descending()))
                .map(PostLike::getPost);
        return postService.pageWithMetrics(posts, viewerId);
    }

    private PostLikeStatusDTO status(Long postId, Long userId) {
        return new PostLikeStatusDTO(postId, repository.countByPostId(postId),
                repository.existsByUserIdAndPostId(userId, postId));
    }
}

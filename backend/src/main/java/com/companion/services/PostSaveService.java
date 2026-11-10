package com.companion.services;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.post.PostResponseDTO;
import com.companion.dtos.post.PostSaveStatusDTO;
import com.companion.entities.Post;
import com.companion.entities.PostSave;
import com.companion.entities.User;
import com.companion.exceptions.ConflictException;
import com.companion.repositories.PostSaveRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostSaveService {
    private final PostSaveRepository repository;
    private final PostService postService;
    private final AuthenticatedUserService authenticatedUserService;

    public PostSaveService(PostSaveRepository repository, PostService postService,
                           AuthenticatedUserService authenticatedUserService) {
        this.repository = repository;
        this.postService = postService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public PostSaveStatusDTO save(Long postId) {
        User user = authenticatedUserService.getCurrentUserWithCompleteProfile();
        Post post = postService.findActive(postId);
        if (repository.existsByUserIdAndPostId(user.getId(), postId)) {
            throw new ConflictException("O post já foi salvo por este usuário");
        }
        repository.saveAndFlush(new PostSave(user, post));
        return new PostSaveStatusDTO(postId, true);
    }

    @Transactional
    public void unsave(Long postId) {
        User user = authenticatedUserService.getCurrentUserWithCompleteProfile();
        postService.findActive(postId);
        repository.findByUserIdAndPostId(user.getId(), postId).ifPresent(repository::delete);
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponseDTO> savedPosts(int page, int size) {
        Long viewerId = authenticatedUserService.getCurrentUserWithCompleteProfile().getId();
        Page<Post> posts = repository.findByUserIdAndPostDeletedAtIsNull(viewerId,
                        PageRequest.of(page, Math.min(size, 50), Sort.by("createdAt").descending()))
                .map(PostSave::getPost);
        return postService.pageWithMetrics(posts, viewerId);
    }
}

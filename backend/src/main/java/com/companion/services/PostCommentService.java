package com.companion.services;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.post.PostCommentCreateRequestDTO;
import com.companion.dtos.post.PostCommentResponseDTO;
import com.companion.entities.Post;
import com.companion.entities.PostComment;
import com.companion.entities.User;
import com.companion.enums.UserRole;
import com.companion.exceptions.ForbiddenOperationException;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.PostCommentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PostCommentService {
    private final PostCommentRepository repository;
    private final PostService postService;
    private final UserService userService;
    private final AuthenticatedUserService authenticatedUserService;

    public PostCommentService(PostCommentRepository repository, PostService postService,
                              UserService userService, AuthenticatedUserService authenticatedUserService) {
        this.repository = repository; this.postService = postService;
        this.userService = userService; this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public PostCommentResponseDTO create(Long postId, PostCommentCreateRequestDTO request) {
        User author = authenticatedUserService.getCurrentUserWithCompleteProfile();
        Post post = postService.findActive(postId);
        PostComment comment = repository.save(new PostComment(post, author, request.content().trim()));
        return toResponse(comment, author.getId());
    }

    @Transactional(readOnly = true)
    public List<PostCommentResponseDTO> listForPost(Long postId) {
        Long viewerId = authenticatedUserService.getCurrentUserWithCompleteProfile().getId();
        postService.findActive(postId);
        return repository.findByPostIdAndDeletedAtIsNullOrderByCreatedAtAsc(postId).stream()
                .map(comment -> toResponse(comment, viewerId)).toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<PostCommentResponseDTO> listForUser(Long userId, int page, int size) {
        Long viewerId = authenticatedUserService.getCurrentUserWithCompleteProfile().getId();
        userService.findVisibleUser(userId);
        Page<PostCommentResponseDTO> result = repository.findByAuthorIdAndDeletedAtIsNull(userId,
                        PageRequest.of(page, Math.min(size, 50), Sort.by("createdAt").descending()))
                .map(comment -> toResponse(comment, viewerId));
        return PageResponse.from(result);
    }

    @Transactional
    public void delete(Long id) {
        User actor = authenticatedUserService.getCurrentUserWithCompleteProfile();
        PostComment comment = findActive(id);
        boolean moderator = actor.getRole() == UserRole.MODERATOR || actor.getRole() == UserRole.ADMIN;
        if (!comment.getAuthor().getId().equals(actor.getId()) && !moderator) {
            throw new ForbiddenOperationException("Somente o autor ou a moderação pode excluir a resposta");
        }
        comment.delete();
        repository.save(comment);
    }

    @Transactional(readOnly = true)
    public PostComment findActive(Long id) {
        return repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resposta não encontrada"));
    }

    private PostCommentResponseDTO toResponse(PostComment comment, Long viewerId) {
        return new PostCommentResponseDTO(comment.getId(), comment.getPost().getId(), comment.getPost().getTitle(),
                userService.toSummary(comment.getAuthor()), comment.getContent(), comment.getCreatedAt(),
                comment.getAuthor().getId().equals(viewerId));
    }
}

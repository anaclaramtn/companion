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
import com.companion.repositories.ReplyCommentRepository;
import com.companion.repositories.ReplyCountProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PostCommentService {
    private final PostCommentRepository repository;
    private final ReplyCommentRepository replyCommentRepository;
    private final PostService postService;
    private final UserService userService;
    private final AuthenticatedUserService authenticatedUserService;

    public PostCommentService(PostCommentRepository repository, ReplyCommentRepository replyCommentRepository,
                              PostService postService, UserService userService,
                              AuthenticatedUserService authenticatedUserService) {
        this.repository = repository; this.replyCommentRepository = replyCommentRepository;
        this.postService = postService;
        this.userService = userService; this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public PostCommentResponseDTO create(Long postId, PostCommentCreateRequestDTO request) {
        User author = authenticatedUserService.getCurrentUserWithCompleteProfile();
        Post post = postService.findActive(postId);
        PostComment comment = repository.save(new PostComment(post, author, request.content().trim()));
        return toResponse(comment, author.getId(), 0);
    }

    @Transactional(readOnly = true)
    public List<PostCommentResponseDTO> listForPost(Long postId) {
        Long viewerId = authenticatedUserService.getCurrentUserWithCompleteProfile().getId();
        postService.findActive(postId);
        List<PostComment> comments = repository.findByPostIdAndDeletedAtIsNullOrderByCreatedAtAsc(postId);
        Map<Long, Long> counts = nestedCounts(comments);
        return comments.stream()
                .map(comment -> toResponse(comment, viewerId, counts.getOrDefault(comment.getId(), 0L))).toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<PostCommentResponseDTO> listForUser(Long userId, int page, int size) {
        Long viewerId = authenticatedUserService.getCurrentUserWithCompleteProfile().getId();
        userService.findVisibleUser(userId);
        Page<PostComment> comments = repository.findByAuthorIdAndDeletedAtIsNull(userId,
                PageRequest.of(page, Math.min(size, 50), Sort.by("createdAt").descending()));
        Map<Long, Long> counts = nestedCounts(comments.getContent());
        return PageResponse.from(comments.map(
                comment -> toResponse(comment, viewerId, counts.getOrDefault(comment.getId(), 0L))));
    }

    @Transactional
    public void delete(Long id) {
        User actor = authenticatedUserService.getCurrentUserWithCompleteProfile();
        PostComment comment = findActive(id);
        boolean moderator = actor.getRole() == UserRole.ADMIN;
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

    // Quantidade de comentários dentro de cada resposta, em uma consulta só.
    private Map<Long, Long> nestedCounts(List<PostComment> comments) {
        if (comments.isEmpty()) return Map.of();
        return replyCommentRepository.countActiveByReplyIds(comments.stream().map(PostComment::getId).toList())
                .stream().collect(Collectors.toMap(ReplyCountProjection::getReplyId, ReplyCountProjection::getTotal));
    }

    private PostCommentResponseDTO toResponse(PostComment comment, Long viewerId, long nestedCount) {
        return new PostCommentResponseDTO(comment.getId(), comment.getPost().getId(), comment.getPost().getTitle(),
                userService.toSummary(comment.getAuthor()), comment.getContent(), comment.getCreatedAt(),
                comment.getAuthor().getId().equals(viewerId), nestedCount);
    }
}

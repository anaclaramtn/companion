package com.companion.services;

import com.companion.dtos.post.ReplyCommentCreateRequestDTO;
import com.companion.dtos.post.ReplyCommentResponseDTO;
import com.companion.entities.PostComment;
import com.companion.entities.ReplyComment;
import com.companion.entities.User;
import com.companion.enums.UserRole;
import com.companion.exceptions.ConflictException;
import com.companion.exceptions.ForbiddenOperationException;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.ReplyCommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Comentários dentro de uma resposta de dúvida. */
@Service
public class ReplyCommentService {
    /** Máximo de comentários dentro de uma mesma resposta. */
    public static final int MAX_COMMENTS_PER_REPLY = 5;

    private final ReplyCommentRepository repository;
    private final PostCommentService replyService;
    private final PostService postService;
    private final UserService userService;
    private final AuthenticatedUserService authenticatedUserService;

    public ReplyCommentService(ReplyCommentRepository repository, PostCommentService replyService,
                               PostService postService, UserService userService,
                               AuthenticatedUserService authenticatedUserService) {
        this.repository = repository;
        this.replyService = replyService;
        this.postService = postService;
        this.userService = userService;
        this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public ReplyCommentResponseDTO create(Long replyId, ReplyCommentCreateRequestDTO request) {
        User author = authenticatedUserService.getCurrentUserWithCompleteProfile();
        PostComment reply = findActiveReply(replyId);
        if (repository.countByReplyIdAndDeletedAtIsNull(replyId) >= MAX_COMMENTS_PER_REPLY) {
            throw new ConflictException("Esta resposta já tem o máximo de " + MAX_COMMENTS_PER_REPLY + " comentários");
        }
        ReplyComment comment = repository.save(new ReplyComment(reply, author, request.content().trim()));
        return toResponse(comment, author.getId());
    }

    @Transactional(readOnly = true)
    public List<ReplyCommentResponseDTO> list(Long replyId) {
        Long viewerId = authenticatedUserService.getCurrentUserWithCompleteProfile().getId();
        findActiveReply(replyId);
        return repository.findByReplyIdAndDeletedAtIsNullOrderByCreatedAtAsc(replyId).stream()
                .map(comment -> toResponse(comment, viewerId)).toList();
    }

    @Transactional
    public void delete(Long id) {
        User actor = authenticatedUserService.getCurrentUserWithCompleteProfile();
        ReplyComment comment = repository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentário não encontrado"));
        boolean moderator = actor.getRole() == UserRole.ADMIN;
        if (!comment.getAuthor().getId().equals(actor.getId()) && !moderator) {
            throw new ForbiddenOperationException("Somente o autor ou a moderação pode excluir o comentário");
        }
        comment.delete();
        repository.save(comment);
    }

    /** A resposta e a dúvida dela precisam estar publicadas (não apagadas). */
    private PostComment findActiveReply(Long replyId) {
        PostComment reply = replyService.findActive(replyId);
        postService.findActive(reply.getPost().getId());
        return reply;
    }

    private ReplyCommentResponseDTO toResponse(ReplyComment comment, Long viewerId) {
        return new ReplyCommentResponseDTO(comment.getId(), comment.getReply().getId(),
                userService.toSummary(comment.getAuthor()), comment.getContent(), comment.getCreatedAt(),
                comment.getAuthor().getId().equals(viewerId));
    }
}

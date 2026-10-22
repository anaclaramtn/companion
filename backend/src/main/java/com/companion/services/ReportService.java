package com.companion.services;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.report.*;
import com.companion.entities.*;
import com.companion.enums.ReportReason;
import com.companion.enums.ReportStatus;
import com.companion.enums.UserRole;
import com.companion.exceptions.BadRequestException;
import com.companion.exceptions.ConflictException;
import com.companion.exceptions.ForbiddenOperationException;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.ReportRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {
    private final ReportRepository repository;
    private final PostService postService;
    private final PostCommentService commentService;
    private final UserService userService;
    private final AuthenticatedUserService authenticatedUserService;

    public ReportService(ReportRepository repository, PostService postService, PostCommentService commentService,
                         UserService userService, AuthenticatedUserService authenticatedUserService) {
        this.repository = repository; this.postService = postService; this.commentService = commentService;
        this.userService = userService; this.authenticatedUserService = authenticatedUserService;
    }

    @Transactional
    public ReportResponseDTO create(ReportCreateRequestDTO request) {
        User reporter = authenticatedUserService.getCurrentUserWithCompleteProfile();
        boolean postTarget = request.postId() != null;
        boolean commentTarget = request.postCommentId() != null;
        if (postTarget == commentTarget) {
            throw new BadRequestException("A denúncia deve indicar exatamente um post ou uma resposta");
        }
        Post post = null;
        PostComment comment = null;
        if (postTarget) {
            post = postService.findActive(request.postId());
            if (post.getAuthor().getId().equals(reporter.getId())) {
                throw new ForbiddenOperationException("O autor não pode denunciar o próprio post");
            }
            if (repository.existsByReporterIdAndPostId(reporter.getId(), post.getId())) {
                throw new ConflictException("Este post já foi denunciado pelo usuário");
            }
        } else {
            comment = commentService.findActive(request.postCommentId());
            postService.findActive(comment.getPost().getId());
            if (comment.getAuthor().getId().equals(reporter.getId())) {
                throw new ForbiddenOperationException("O autor não pode denunciar a própria resposta");
            }
            if (repository.existsByReporterIdAndPostCommentId(reporter.getId(), comment.getId())) {
                throw new ConflictException("Esta resposta já foi denunciada pelo usuário");
            }
        }
        Report report = repository.saveAndFlush(new Report(reporter, post, comment, request.reason(),
                request.details() == null || request.details().isBlank() ? null : request.details().trim()));
        return toResponse(report);
    }

    @Transactional(readOnly = true)
    public PageResponse<ReportResponseDTO> list(ReportStatus status, int page, int size) {
        authenticatedUserService.requireAnyRole(UserRole.MODERATOR, UserRole.ADMIN);
        Page<Report> reports = status == null
                ? repository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, Math.min(size, 100)))
                : repository.findByStatusOrderByCreatedAtAsc(status, PageRequest.of(page, Math.min(size, 100)));
        return PageResponse.from(reports.map(this::toResponse));
    }

    @Transactional(readOnly = true)
    public ReportResponseDTO get(Long id) {
        authenticatedUserService.requireAnyRole(UserRole.MODERATOR, UserRole.ADMIN);
        return toResponse(find(id));
    }

    @Transactional
    public ReportResponseDTO review(Long id, ReportReviewRequestDTO request) {
        User reviewer = authenticatedUserService.requireAnyRole(UserRole.MODERATOR, UserRole.ADMIN);
        if (request.status() == ReportStatus.PENDING) {
            throw new BadRequestException("A análise deve resultar em RESOLVED ou DISMISSED");
        }
        Report report = find(id);
        if (report.getStatus() != ReportStatus.PENDING) {
            throw new ConflictException("A denúncia já foi analisada");
        }
        if (!reviewer.isProfileComplete()) {
            throw new ForbiddenOperationException("Conclua o perfil antes de acessar esta funcionalidade");
        }
        report.review(reviewer, request.status());
        return toResponse(repository.save(report));
    }

    private Report find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Denúncia não encontrada"));
    }

    private ReportResponseDTO toResponse(Report report) {
        boolean postTarget = report.getPost() != null;
        String preview = postTarget ? report.getPost().getTitle() : abbreviate(report.getPostComment().getContent());
        return new ReportResponseDTO(report.getId(), userService.toSummary(report.getReporter()),
                report.getReviewedBy() == null ? null : userService.toSummary(report.getReviewedBy()),
                postTarget ? "POST" : "POST_COMMENT",
                postTarget ? report.getPost().getId() : report.getPostComment().getId(),
                postTarget ? report.getPost().getId() : report.getPostComment().getPost().getId(), preview,
                report.getReason(), report.getDetails(), report.getStatus(), report.getCreatedAt(), report.getReviewedAt());
    }

    private String abbreviate(String text) { return text.length() <= 160 ? text : text.substring(0, 157) + "..."; }
}

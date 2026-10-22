package com.companion.repositories;

import com.companion.entities.Report;
import com.companion.enums.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {
    boolean existsByReporterIdAndPostId(Long reporterId, Long postId);
    boolean existsByReporterIdAndPostCommentId(Long reporterId, Long postCommentId);

    @Override
    @EntityGraph(attributePaths = {"reporter", "reviewedBy", "post", "postComment", "postComment.post"})
    Optional<Report> findById(Long id);

    @EntityGraph(attributePaths = {"reporter", "reviewedBy", "post", "postComment", "postComment.post"})
    Page<Report> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"reporter", "reviewedBy", "post", "postComment", "postComment.post"})
    Page<Report> findByStatusOrderByCreatedAtAsc(ReportStatus status, Pageable pageable);
}

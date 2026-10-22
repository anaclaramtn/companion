package com.companion.entities;

import com.companion.enums.ReportReason;
import com.companion.enums.ReportStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.Check;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_reports_reporter_post", columnNames = {"reporter_id", "post_id"}),
                @UniqueConstraint(name = "uk_reports_reporter_comment", columnNames = {"reporter_id", "post_comment_id"})
        },
        indexes = {
                @Index(name = "idx_reports_status_created", columnList = "status,created_at"),
                @Index(name = "idx_reports_post", columnList = "post_id"),
                @Index(name = "idx_reports_comment", columnList = "post_comment_id")
        })
@Check(constraints = "(post_id is not null and post_comment_id is null) or (post_id is null and post_comment_id is not null)")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reporter_id", nullable = false, foreignKey = @ForeignKey(name = "fk_reports_reporter"))
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_id", foreignKey = @ForeignKey(name = "fk_reports_reviewer"))
    private User reviewedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", foreignKey = @ForeignKey(name = "fk_reports_post"))
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_comment_id", foreignKey = @ForeignKey(name = "fk_reports_comment"))
    private PostComment postComment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ReportReason reason;

    @Column(length = 500)
    private String details;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReportStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    protected Report() { }

    public Report(User reporter, Post post, PostComment postComment, ReportReason reason, String details) {
        this.reporter = reporter;
        this.post = post;
        this.postComment = postComment;
        this.reason = reason;
        this.details = details;
        this.status = ReportStatus.PENDING;
    }

    @PrePersist private void prePersist() { createdAt = LocalDateTime.now(); }
    public void review(User reviewer, ReportStatus status) {
        this.reviewedBy = reviewer;
        this.status = status;
        this.reviewedAt = LocalDateTime.now();
    }
    public Long getId() { return id; }
    public User getReporter() { return reporter; }
    public User getReviewedBy() { return reviewedBy; }
    public Post getPost() { return post; }
    public PostComment getPostComment() { return postComment; }
    public ReportReason getReason() { return reason; }
    public String getDetails() { return details; }
    public ReportStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
}

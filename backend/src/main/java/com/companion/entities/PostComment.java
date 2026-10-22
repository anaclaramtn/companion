package com.companion.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "post_comments", indexes = {
        @Index(name = "idx_post_comments_post", columnList = "post_id"),
        @Index(name = "idx_post_comments_author", columnList = "author_id"),
        @Index(name = "idx_post_comments_created_at", columnList = "created_at"),
        @Index(name = "idx_post_comments_deleted_at", columnList = "deleted_at")
})
public class PostComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false, foreignKey = @ForeignKey(name = "fk_post_comments_post"))
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false, foreignKey = @ForeignKey(name = "fk_post_comments_author"))
    private User author;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    protected PostComment() { }

    public PostComment(Post post, User author, String content) {
        this.post = post;
        this.author = author;
        this.content = content;
    }

    @PrePersist
    private void prePersist() { createdAt = LocalDateTime.now(); }
    public void delete() { if (deletedAt == null) deletedAt = LocalDateTime.now(); }
    public boolean isDeleted() { return deletedAt != null; }
    public Long getId() { return id; }
    public Post getPost() { return post; }
    public User getAuthor() { return author; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
}

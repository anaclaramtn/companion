package com.companion.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts", indexes = {
        @Index(name = "idx_posts_created_at", columnList = "created_at"),
        @Index(name = "idx_posts_author", columnList = "author_id"),
        @Index(name = "idx_posts_subject", columnList = "subject_id"),
        @Index(name = "idx_posts_deleted_at", columnList = "deleted_at")
})
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false, foreignKey = @ForeignKey(name = "fk_posts_author"))
    private User author;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false, foreignKey = @ForeignKey(name = "fk_posts_subject"))
    private Subject subject;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    protected Post() { }

    public Post(User author, Subject subject, String title, String content) {
        this.author = author;
        this.subject = subject;
        this.title = title;
        this.content = content;
    }

    @PrePersist
    private void prePersist() { createdAt = LocalDateTime.now(); }
    public void delete() { if (deletedAt == null) deletedAt = LocalDateTime.now(); }
    public boolean isDeleted() { return deletedAt != null; }
    public Long getId() { return id; }
    public User getAuthor() { return author; }
    public Subject getSubject() { return subject; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
}

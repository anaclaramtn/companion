package com.companion.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "post_saves",
        uniqueConstraints = @UniqueConstraint(name = "uk_post_saves_user_post", columnNames = {"user_id", "post_id"}),
        indexes = @Index(name = "idx_post_saves_post", columnList = "post_id"))
public class PostSave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_post_saves_user"))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false, foreignKey = @ForeignKey(name = "fk_post_saves_post"))
    private Post post;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected PostSave() { }

    public PostSave(User user, Post post) { this.user = user; this.post = post; }
    @PrePersist private void prePersist() { createdAt = LocalDateTime.now(); }
    public Long getId() { return id; }
    public User getUser() { return user; }
    public Post getPost() { return post; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

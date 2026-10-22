package com.companion.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.Check;

import java.time.LocalDateTime;

@Entity
@Table(name = "follows",
        uniqueConstraints = @UniqueConstraint(name = "uk_follows_follower_followed", columnNames = {"follower_id", "followed_id"}),
        indexes = {
                @Index(name = "idx_follows_follower", columnList = "follower_id"),
                @Index(name = "idx_follows_followed", columnList = "followed_id")
        })
@Check(constraints = "follower_id <> followed_id")
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "follower_id", nullable = false, foreignKey = @ForeignKey(name = "fk_follows_follower"))
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "followed_id", nullable = false, foreignKey = @ForeignKey(name = "fk_follows_followed"))
    private User followed;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Follow() { }
    public Follow(User follower, User followed) { this.follower = follower; this.followed = followed; }
    @PrePersist private void prePersist() { createdAt = LocalDateTime.now(); }
    public Long getId() { return id; }
    public User getFollower() { return follower; }
    public User getFollowed() { return followed; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

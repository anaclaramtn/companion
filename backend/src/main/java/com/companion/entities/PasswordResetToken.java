package com.companion.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens",
        uniqueConstraints = @UniqueConstraint(name = "uk_password_reset_tokens_hash", columnNames = "token_hash"),
        indexes = {
                @Index(name = "idx_password_reset_tokens_user", columnList = "user_id"),
                @Index(name = "idx_password_reset_tokens_expiry", columnList = "expires_at")
        })
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_password_reset_tokens_user"))
    private User user;
    @Column(name = "token_hash", nullable = false, length = 64)
    private String tokenHash;
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    @Column(name = "used_at")
    private LocalDateTime usedAt;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected PasswordResetToken() { }
    public PasswordResetToken(User user, String tokenHash, LocalDateTime expiresAt) {
        this.user = user; this.tokenHash = tokenHash; this.expiresAt = expiresAt;
    }
    @PrePersist private void prePersist() { createdAt = LocalDateTime.now(); }
    public void use() { usedAt = LocalDateTime.now(); }
    public boolean isUsableAt(LocalDateTime now) { return usedAt == null && expiresAt.isAfter(now); }
    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getTokenHash() { return tokenHash; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public LocalDateTime getUsedAt() { return usedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

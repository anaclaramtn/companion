package com.companion.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

// Reservada para a confirmação de e-mail, que ainda está fora do fluxo.
// Por enquanto só a tabela existe: nenhum repositório ou serviço usa esta entidade.
@Entity
@Table(name = "email_verification_tokens",
        uniqueConstraints = @UniqueConstraint(name = "uk_email_verification_tokens_hash", columnNames = "token_hash"),
        indexes = @Index(name = "idx_email_verification_tokens_user", columnList = "user_id"))
public class EmailVerificationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_email_verification_tokens_user"))
    private User user;
    @Column(name = "token_hash", nullable = false, length = 64)
    private String tokenHash;
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    @Column(name = "used_at")
    private LocalDateTime usedAt;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected EmailVerificationToken() { }
    public EmailVerificationToken(User user, String tokenHash, LocalDateTime expiresAt) {
        this.user = user; this.tokenHash = tokenHash; this.expiresAt = expiresAt;
    }
    @PrePersist private void prePersist() { createdAt = LocalDateTime.now(); }
    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getTokenHash() { return tokenHash; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public LocalDateTime getUsedAt() { return usedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

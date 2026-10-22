package com.companion.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "faqs", indexes = @Index(name = "idx_faqs_active_order", columnList = "active,display_order"))
public class Faq {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 255)
    private String question;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;
    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
    @Column(nullable = false)
    private boolean active;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected Faq() { }
    public Faq(String question, String answer, Integer displayOrder, boolean active) {
        this.question = question; this.answer = answer; this.displayOrder = displayOrder; this.active = active;
    }
    @PrePersist private void prePersist() { createdAt = LocalDateTime.now(); updatedAt = createdAt; }
    @PreUpdate private void preUpdate() { updatedAt = LocalDateTime.now(); }
    public void update(String question, String answer, Integer displayOrder, boolean active) {
        this.question = question; this.answer = answer; this.displayOrder = displayOrder; this.active = active;
    }
    public Long getId() { return id; }
    public String getQuestion() { return question; }
    public String getAnswer() { return answer; }
    public Integer getDisplayOrder() { return displayOrder; }
    public boolean isActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

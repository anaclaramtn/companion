package com.companion.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "posts", indexes = {
        @Index(name = "idx_posts_created_at", columnList = "created_at"),
        @Index(name = "idx_posts_author", columnList = "author_id"),
        @Index(name = "idx_posts_deleted_at", columnList = "deleted_at")
})
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false, foreignKey = @ForeignKey(name = "fk_posts_author"))
    private User author;

    // Uma linha em post_subjects para cada disciplina do post.
    @ManyToMany
    @JoinTable(name = "post_subjects",
            joinColumns = @JoinColumn(name = "post_id", foreignKey = @ForeignKey(name = "fk_post_subjects_post")),
            inverseJoinColumns = @JoinColumn(name = "subject_id", foreignKey = @ForeignKey(name = "fk_post_subjects_subject")),
            indexes = @Index(name = "idx_post_subjects_subject", columnList = "subject_id"))
    @BatchSize(size = 50)
    private Set<Subject> subjects = new LinkedHashSet<>();

    @Column(nullable = false, length = 128)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    protected Post() { }

    public Post(User author, Set<Subject> subjects, String title, String content) {
        this.author = author;
        this.subjects = new LinkedHashSet<>(subjects);
        this.title = title;
        this.content = content;
    }

    @PrePersist
    private void prePersist() { createdAt = LocalDateTime.now(); }
    public void delete() { if (deletedAt == null) deletedAt = LocalDateTime.now(); }
    public boolean isDeleted() { return deletedAt != null; }
    public Long getId() { return id; }
    public User getAuthor() { return author; }
    public List<Subject> getSubjects() {
        return subjects.stream().sorted(Comparator.comparing(Subject::getName)).toList();
    }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
}

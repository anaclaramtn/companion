package com.companion.entities;

import com.companion.enums.SubjectInterestType;
import jakarta.persistence.*;

// Disciplina marcada pelo aluno como "domina" ou "quer aprender".
// Quem não domina nem quer aprender a disciplina simplesmente não tem linha aqui.
@Entity
@Table(
        name = "user_subjects",
        uniqueConstraints = @UniqueConstraint(name = "uk_user_subjects_user_subject", columnNames = {"user_id", "subject_id"}),
        indexes = {
                @Index(name = "idx_user_subjects_user", columnList = "user_id"),
                @Index(name = "idx_user_subjects_subject", columnList = "subject_id")
        }
)
public class UserSubject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_subjects_user"))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_subjects_subject"))
    private Subject subject;

    @Enumerated(EnumType.STRING)
    @Column(name = "interest_type", nullable = false, length = 30)
    private SubjectInterestType interestType;

    protected UserSubject() { }

    public UserSubject(User user, Subject subject, SubjectInterestType interestType) {
        this.user = user;
        this.subject = subject;
        this.interestType = interestType;
    }

    public void update(SubjectInterestType interestType) {
        this.interestType = interestType;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Subject getSubject() { return subject; }
    public SubjectInterestType getInterestType() { return interestType; }
}

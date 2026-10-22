package com.companion.entities;

import com.companion.enums.UserRole;
import com.companion.enums.UserStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_email", columnNames = "email"),
                @UniqueConstraint(name = "uk_users_username", columnNames = "username"),
                @UniqueConstraint(name = "uk_users_registration_number", columnNames = "registration_number")
        },
        indexes = {
                @Index(name = "idx_users_status", columnList = "status"),
                @Index(name = "idx_users_name", columnList = "name")
        }
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column(length = 120)
    private String name;

    @Column(length = 30)
    private String username;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(length = 500)
    private String bio;

    @Column(name = "registration_number", length = 30)
    private String registrationNumber;

    @Column(length = 120)
    private String course;

    private Integer semester;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status;

    @Column(name = "onboarding_completed_at")
    private LocalDateTime onboardingCompletedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    protected User() {
    }

    public User(String email, String passwordHash) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = UserRole.USER;
        this.status = UserStatus.ACTIVE;
    }

    @PrePersist
    private void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    private void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void updateProfile(String name, String username, String avatarUrl, String bio,
                              String registrationNumber, String course, Integer semester) {
        this.name = name;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.registrationNumber = registrationNumber;
        this.course = course;
        this.semester = semester;
    }

    public void completeOnboarding() {
        if (onboardingCompletedAt == null) {
            onboardingCompletedAt = LocalDateTime.now();
        }
    }

    public void changeRole(UserRole role) {
        this.role = role;
    }

    public void changeStatus(UserStatus status) {
        this.status = status;
    }

    public void updatePassword(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void anonymize(String anonymousEmail, String anonymousUsername, String unusablePasswordHash) {
        name = "Usuário excluído";
        email = anonymousEmail;
        username = anonymousUsername;
        passwordHash = unusablePasswordHash;
        avatarUrl = null;
        bio = null;
        registrationNumber = null;
        course = null;
        semester = null;
        onboardingCompletedAt = null;
        role = UserRole.USER;
        status = UserStatus.DELETED;
        deletedAt = LocalDateTime.now();
    }

    public boolean isProfileComplete() {
        return name != null && !name.isBlank() && username != null && !username.isBlank();
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getName() { return name; }
    public String getUsername() { return username; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getBio() { return bio; }
    public String getRegistrationNumber() { return registrationNumber; }
    public String getCourse() { return course; }
    public Integer getSemester() { return semester; }
    public UserRole getRole() { return role; }
    public UserStatus getStatus() { return status; }
    public LocalDateTime getOnboardingCompletedAt() { return onboardingCompletedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
}

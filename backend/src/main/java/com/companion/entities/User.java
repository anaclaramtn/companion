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
                @UniqueConstraint(name = "uk_users_firebase_uid", columnNames = "firebase_uid"),
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

    /**
     * Identificador da conta no Firebase, que guarda a senha.
     * Null nos usuários de exemplo que ainda não entraram e em contas excluídas.
     */
    @Column(name = "firebase_uid", length = 128)
    private String firebaseUid;

    @Column(name = "email_verified_at")
    private LocalDateTime emailVerifiedAt;

    @Column(length = 64)
    private String name;

    @Column(length = 30)
    private String username;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(length = 512)
    private String bio;

    /** Estilo do banner do perfil: GRADIENT, WAVES, WAVES_2, WAVES_3 ou SOLID (null = GRADIENT). */
    @Column(name = "banner_style", length = 20)
    private String bannerStyle;

    /** Cor (#rrggbb) usada pelo banner SOLID; null usa a cor do tema. */
    @Column(name = "banner_color", length = 7)
    private String bannerColor;

    @Column(name = "registration_number", length = 30)
    private String registrationNumber;

    @ManyToOne
    @JoinColumn(name = "course_id", foreignKey = @ForeignKey(name = "fk_users_course"))
    private Course course;

    private Integer semester;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status;

    /** Quando a pessoa aceitou os Termos e a Política de Privacidade (null em contas antigas). */
    @Column(name = "terms_accepted_at")
    private LocalDateTime termsAcceptedAt;

    /** Versão dos termos aceita (data da versão, ex.: 2026-11-17). */
    @Column(name = "terms_version", length = 20)
    private String termsVersion;

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

    public User(String email) {
        this.email = email;
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

    public void linkFirebase(String firebaseUid) {
        this.firebaseUid = firebaseUid;
    }

    public void markEmailVerified() {
        if (emailVerifiedAt == null) {
            emailVerifiedAt = LocalDateTime.now();
        }
    }

    public void updateProfile(String name, String username, String bio,
                              String registrationNumber, Course course, Integer semester) {
        this.name = name;
        this.username = username;
        this.bio = bio;
        this.registrationNumber = registrationNumber;
        this.course = course;
        this.semester = semester;
    }

    public void updateBanner(String bannerStyle, String bannerColor) {
        this.bannerStyle = bannerStyle;
        this.bannerColor = bannerColor;
    }

    public void updateAvatar(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void acceptTerms(String version) {
        this.termsAcceptedAt = LocalDateTime.now();
        this.termsVersion = version;
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

    public void anonymize(String anonymousEmail, String anonymousUsername) {
        name = "Usuário excluído";
        email = anonymousEmail;
        username = anonymousUsername;
        firebaseUid = null;
        emailVerifiedAt = null;
        avatarUrl = null;
        bio = null;
        bannerStyle = null;
        bannerColor = null;
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
    public String getFirebaseUid() { return firebaseUid; }
    public String getName() { return name; }
    public String getUsername() { return username; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getBio() { return bio; }
    public String getBannerStyle() { return bannerStyle; }
    public String getBannerColor() { return bannerColor; }
    public String getRegistrationNumber() { return registrationNumber; }
    public LocalDateTime getEmailVerifiedAt() { return emailVerifiedAt; }
    public Course getCourse() { return course; }
    public Integer getSemester() { return semester; }
    public UserRole getRole() { return role; }
    public UserStatus getStatus() { return status; }
    public LocalDateTime getTermsAcceptedAt() { return termsAcceptedAt; }
    public String getTermsVersion() { return termsVersion; }
    public LocalDateTime getOnboardingCompletedAt() { return onboardingCompletedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
}

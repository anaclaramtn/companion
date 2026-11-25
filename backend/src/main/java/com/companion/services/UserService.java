package com.companion.services;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.user.*;
import com.companion.entities.User;
import com.companion.enums.UserRole;
import com.companion.enums.UserStatus;
import com.companion.exceptions.BadRequestException;
import com.companion.exceptions.ConflictException;
import com.companion.exceptions.DuplicateResourceException;
import com.companion.exceptions.ForbiddenOperationException;
import com.companion.exceptions.TermsAcceptanceRequiredException;
import com.companion.firebase.FirebaseAccountDeletedEvent;
import com.companion.firebase.FirebaseIdentity;
import org.springframework.context.ApplicationEventPublisher;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.entities.Course;
import com.companion.repositories.CourseRepository;
import com.companion.repositories.UserRepository;
import com.companion.repositories.UserSubjectRepository;
import com.companion.enums.SubjectInterestType;
import com.companion.repositories.PostRepository;
import com.companion.repositories.PostCommentRepository;
import com.companion.repositories.FollowRepository;
import com.companion.repositories.UserCountProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class UserService {

    private static final String INSTITUTIONAL_EMAIL_DOMAIN = "@edu.unifor.br";
    private static final int MAX_EMAIL_LENGTH = 150;
    /** Mesmo endereço de SUPPORT_EMAIL em frontend/src/data/support.js. */
    private static final String SUPPORT_EMAIL = "companion.app@proton.me";
    /**
     * Versão atual dos Termos e da Política de Privacidade (a data da última atualização).
     * Mantenha igual a TERMS_VERSION em frontend/src/data/terms.js e mude as duas juntas.
     */
    public static final String TERMS_VERSION = "2026-11-25";

    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final AuthenticatedUserService authenticatedUserService;
    private final PostRepository postRepository;
    private final PostCommentRepository postCommentRepository;
    private final FollowRepository followRepository;
    private final CourseRepository courseRepository;
    private final UserSubjectRepository userSubjectRepository;

    public UserService(UserRepository userRepository, ApplicationEventPublisher eventPublisher,
                       AuthenticatedUserService authenticatedUserService,
                       PostRepository postRepository,
                       PostCommentRepository postCommentRepository,
                       FollowRepository followRepository,
                       CourseRepository courseRepository,
                       UserSubjectRepository userSubjectRepository) {
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
        this.authenticatedUserService = authenticatedUserService;
        this.postRepository = postRepository;
        this.postCommentRepository = postCommentRepository;
        this.followRepository = followRepository;
        this.courseRepository = courseRepository;
        this.userSubjectRepository = userSubjectRepository;
    }

    /**
     * Acha o usuário de quem acabou de se autenticar no Firebase, ou cria a conta
     * no primeiro acesso. Estas regras valem no servidor.
     */
    @Transactional
    public User signInWithFirebase(FirebaseIdentity identity, boolean acceptedTerms) {
        // Sem a verificação, qualquer um poderia usar o e-mail de outra pessoa.
        if (identity.email() == null || !identity.emailVerified()) {
            throw new ForbiddenOperationException("Confirme seu e-mail antes de entrar");
        }
        String email = normalizeEmail(identity.email());
        if (!email.endsWith(INSTITUTIONAL_EMAIL_DOMAIN)) {
            throw new ForbiddenOperationException(
                    "Use seu e-mail institucional (" + INSTITUTIONAL_EMAIL_DOMAIN + ")");
        }

        User user = userRepository.findByFirebaseUid(identity.uid())
                .or(() -> userRepository.findByEmailIgnoreCase(email))
                .orElse(null);
        if (user == null) {
            return createFromFirebase(identity, email, acceptedTerms);
        }
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ForbiddenOperationException("A conta não está ativa. Fale com o suporte: " + SUPPORT_EMAIL);
        }
        if (user.getFirebaseUid() == null) {
            user.linkFirebase(identity.uid());
        } else if (!user.getFirebaseUid().equals(identity.uid())) {
            throw new ConflictException("Este e-mail já está ligado a outro login. Fale com o suporte: " + SUPPORT_EMAIL);
        }
        user.markEmailVerified();
        return userRepository.save(user);
    }

    private User createFromFirebase(FirebaseIdentity identity, String email, boolean acceptedTerms) {
        if (!acceptedTerms) {
            throw new TermsAcceptanceRequiredException();
        }
        if (email.length() > MAX_EMAIL_LENGTH) {
            throw new BadRequestException("O e-mail deve ter no máximo " + MAX_EMAIL_LENGTH + " caracteres");
        }
        User user = new User(email);
        user.linkFirebase(identity.uid());
        user.markEmailVerified();
        // Guarda quando e qual versão dos termos foi aceita (prova do consentimento).
        user.acceptTerms(TERMS_VERSION);
        return userRepository.save(user);
    }

    /** Dados da própria conta, lidos dentro de uma transação (o curso é uma relação). */
    @Transactional(readOnly = true)
    public UserAccountResponseDTO accountOf(Long id) {
        return toAccount(findAnyUser(id));
    }

    @Transactional(readOnly = true)
    public UserAccountResponseDTO getCurrentAccount() {
        return toAccount(authenticatedUserService.getCurrentUser());
    }

    @Transactional(readOnly = true)
    public UserPublicResponseDTO getPublicProfile(Long id) {
        return toPublic(findVisibleUser(id));
    }

    @Transactional(readOnly = true)
    public PageResponse<UserSearchResultDTO> search(String query, Long subjectId, int page, int size) {
        Page<User> users = userRepository.searchPublic(
                normalizeQuery(query),
                subjectId,
                PageRequest.of(page, Math.min(size, 50), Sort.by("name").ascending()));
        List<Long> userIds = users.getContent().stream().map(User::getId).toList();
        Map<Long, List<String>> dominated = new HashMap<>();
        if (!userIds.isEmpty()) {
            userSubjectRepository
                    .findByUserIdInAndInterestTypeOrderBySubjectNameAsc(userIds, SubjectInterestType.DOMINA)
                    .forEach(link -> dominated
                            .computeIfAbsent(link.getUser().getId(), id -> new ArrayList<>())
                            .add(link.getSubject().getName()));
        }
        return PageResponse.from(users.map(user -> new UserSearchResultDTO(
                user.getId(), user.getName(), user.getUsername(), AvatarImageService.publicUrl(user.getAvatarUrl()), courseName(user),
                dominated.getOrDefault(user.getId(), List.of()))));
    }

    /**
     * Atualização parcial: só muda os campos enviados. Assim cada etapa do
     * onboarding pode salvar a sua parte sem apagar o que as outras salvaram.
     */
    @Transactional
    public UserAccountResponseDTO updateOwnProfile(UserProfileUpdateRequestDTO request) {
        User user = authenticatedUserService.getCurrentUser();
        String name = request.name() == null ? user.getName() : request.name().trim();
        String username = request.username() == null
                ? user.getUsername()
                : normalizeUsername(request.username());
        String bio = request.bio() == null ? user.getBio() : normalizeOptionalText(request.bio());
        String registration = request.registrationNumber() == null
                ? user.getRegistrationNumber()
                : normalizeRegistrationNumber(request.registrationNumber());

        if (request.username() != null
                && userRepository.existsByUsernameIgnoreCaseAndIdNot(username, user.getId())) {
            throw new DuplicateResourceException("O username já está em uso");
        }
        if (request.registrationNumber() != null && registration != null
                && userRepository.existsByRegistrationNumberIgnoreCaseAndIdNot(registration, user.getId())) {
            throw new DuplicateResourceException("A matrícula já está em uso");
        }

        Course course = user.getCourse();
        if (request.courseId() != null) {
            course = courseRepository.findById(request.courseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));
        }
        Integer semester = request.semester() == null ? user.getSemester() : request.semester();
        if (course != null && semester != null && semester > course.getTotalSemesters()) {
            throw new BadRequestException("O curso tem apenas " + course.getTotalSemesters() + " semestres");
        }

        user.updateProfile(name, username, bio, registration, course, semester);
        if (request.bannerStyle() != null) {
            user.updateBanner(request.bannerStyle(), request.bannerColor());
        }
        return toAccount(userRepository.save(user));
    }

    /** Grava (ou apaga, com null) o endereço da foto. O envio da imagem fica em UserAvatarService. */
    @Transactional
    public UserAccountResponseDTO changeOwnAvatarUrl(String avatarUrl) {
        User user = authenticatedUserService.getCurrentUser();
        user.updateAvatar(avatarUrl);
        return toAccount(userRepository.save(user));
    }

    @Transactional
    public UserAccountResponseDTO completeOnboarding() {
        User user = authenticatedUserService.getCurrentUserWithCompleteProfile();
        user.completeOnboarding();
        return toAccount(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public PageResponse<UserAdminResponseDTO> listForAdministration(String query, int page, int size) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        Page<UserAdminResponseDTO> result = userRepository.searchAdmin(
                        normalizeQuery(query),
                        PageRequest.of(page, Math.min(size, 100), Sort.by("createdAt").descending())
                )
                .map(this::toAdmin);
        return PageResponse.from(result);
    }

    @Transactional
    public UserAdminResponseDTO changeRole(Long id, UserRoleUpdateRequestDTO request) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        User user = findAnyUser(id);
        if (user.getStatus() == UserStatus.DELETED) {
            throw new ConflictException("Não é possível alterar uma conta excluída");
        }
        user.changeRole(request.role());
        return toAdmin(userRepository.save(user));
    }

    @Transactional
    public UserAdminResponseDTO changeStatus(Long id, UserStatusUpdateRequestDTO request) {
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        if (request.status() == UserStatus.DELETED) {
            throw new BadRequestException("Use a operação de exclusão para remover uma conta");
        }
        User user = findAnyUser(id);
        if (user.getStatus() == UserStatus.DELETED) {
            throw new ConflictException("Não é possível reativar uma conta excluída");
        }
        user.changeStatus(request.status());
        return toAdmin(userRepository.save(user));
    }

    @Transactional
    public void deleteOwnAccount() {
        anonymize(authenticatedUserService.getCurrentUser());
    }

    @Transactional
    public void deleteByAdministration(Long id) {
        User actor = authenticatedUserService.requireAnyRole(UserRole.ADMIN);
        if (actor.getId().equals(id)) {
            throw new BadRequestException("Para excluir a sua própria conta, use as Configurações");
        }
        User user = findAnyUser(id);
        if (user.getStatus() == UserStatus.DELETED) {
            throw new ConflictException("A conta já foi excluída");
        }
        anonymize(user);
    }

    @Transactional(readOnly = true)
    public User findVisibleUser(Long id) {
        return userRepository.findByIdAndStatusNot(id, UserStatus.DELETED)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    public UserAccountResponseDTO toAccount(User user) {
        return new UserAccountResponseDTO(
                user.getId(), user.getEmail(), user.getName(), user.getUsername(), AvatarImageService.publicUrl(user.getAvatarUrl()),
                user.getBio(), user.getBannerStyle(), user.getBannerColor(), user.getRegistrationNumber(),
                courseId(user), courseName(user), universityId(user), universityName(user), user.getSemester(),
                user.getRole(), user.getStatus(), user.isProfileComplete(), user.getOnboardingCompletedAt(),
                user.getCreatedAt(), user.getUpdatedAt()
        );
    }

    public UserSummaryResponseDTO toSummary(User user) {
        return new UserSummaryResponseDTO(user.getId(), user.getName(), user.getUsername(), AvatarImageService.publicUrl(user.getAvatarUrl()));
    }

    private User findAnyUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private void anonymize(User user) {
        String firebaseUid = user.getFirebaseUid();
        String suffix = user.getId() + "-" + UUID.randomUUID();
        user.anonymize(
                "deleted-" + suffix + "@companion.invalid",
                "deleted" + user.getId() + UUID.randomUUID().toString().replace("-", "").substring(0, 8)
        );
        userRepository.save(user);
        if (firebaseUid != null) {
            eventPublisher.publishEvent(new FirebaseAccountDeletedEvent(firebaseUid));
        }
    }

    private UserPublicResponseDTO toPublic(User user) {
        return toPublic(user,
                postRepository.countByAuthorIdAndDeletedAtIsNull(user.getId()),
                postCommentRepository.countByAuthorIdAndDeletedAtIsNull(user.getId()),
                followRepository.countByFollowedId(user.getId()),
                followRepository.countByFollowerId(user.getId()));
    }

    private UserPublicResponseDTO toPublic(User user, long posts, long comments, long followers, long following) {
        return new UserPublicResponseDTO(
                user.getId(), user.getName(), user.getUsername(), AvatarImageService.publicUrl(user.getAvatarUrl()), user.getBio(),
                user.getBannerStyle(), user.getBannerColor(),
                courseId(user), courseName(user), universityId(user), universityName(user), user.getSemester(),
                posts, comments, followers, following,
                user.getCreatedAt()
        );
    }

    private Long courseId(User user) {
        return user.getCourse() == null ? null : user.getCourse().getId();
    }

    private String courseName(User user) {
        return user.getCourse() == null ? null : user.getCourse().getName();
    }

    private Long universityId(User user) {
        return user.getCourse() == null ? null : user.getCourse().getUniversity().getId();
    }

    private String universityName(User user) {
        return user.getCourse() == null ? null : user.getCourse().getUniversity().getName();
    }

    private Map<Long, Long> counts(List<Long> userIds, List<UserCountProjection> rows) {
        if (userIds.isEmpty()) return Map.of();
        return rows.stream().collect(Collectors.toMap(UserCountProjection::getUserId, UserCountProjection::getTotal));
    }

    private UserAdminResponseDTO toAdmin(User user) {
        return new UserAdminResponseDTO(
                user.getId(), user.getEmail(), user.getName(), user.getUsername(), user.getRegistrationNumber(),
                user.getRole(), user.getStatus(), user.getCreatedAt(), user.getUpdatedAt(), user.getDeletedAt()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeUsername(String username) {
        return username.trim().replaceFirst("^@", "").toLowerCase(Locale.ROOT);
    }

    private String normalizeRegistrationNumber(String registrationNumber) {
        String value = normalizeOptionalText(registrationNumber);
        return value == null ? null : value.toUpperCase(Locale.ROOT);
    }

    private String normalizeOptionalText(String text) {
        return text == null || text.isBlank() ? null : text.trim();
    }

    private String normalizeQuery(String query) {
        return query == null || query.isBlank() ? null : query.trim();
    }
}

package com.companion.services;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.user.*;
import com.companion.entities.User;
import com.companion.enums.UserRole;
import com.companion.enums.UserStatus;
import com.companion.exceptions.BadRequestException;
import com.companion.exceptions.ConflictException;
import com.companion.exceptions.DuplicateResourceException;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.UserRepository;
import com.companion.repositories.PostRepository;
import com.companion.repositories.PostCommentRepository;
import com.companion.repositories.FollowRepository;
import com.companion.repositories.UserCountProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticatedUserService authenticatedUserService;
    private final PostRepository postRepository;
    private final PostCommentRepository postCommentRepository;
    private final FollowRepository followRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticatedUserService authenticatedUserService,
                       PostRepository postRepository,
                       PostCommentRepository postCommentRepository,
                       FollowRepository followRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticatedUserService = authenticatedUserService;
        this.postRepository = postRepository;
        this.postCommentRepository = postCommentRepository;
        this.followRepository = followRepository;
    }

    @Transactional
    public User register(UserRegistrationRequestDTO request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException("Já existe uma conta com esse e-mail");
        }
        return userRepository.save(new User(email, passwordEncoder.encode(request.password())));
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
    public PageResponse<UserPublicResponseDTO> search(String query, int page, int size) {
        Page<User> users = userRepository.searchPublic(
                normalizeQuery(query),
                PageRequest.of(page, Math.min(size, 50), Sort.by("name").ascending()));
        if (users.isEmpty()) return PageResponse.from(users.map(this::toPublic));
        List<Long> userIds = users.getContent().stream().map(User::getId).toList();
        Map<Long, Long> postCounts = counts(userIds, postRepository.countActiveByAuthorIds(userIds));
        Map<Long, Long> commentCounts = counts(userIds, postCommentRepository.countActiveByAuthorIds(userIds));
        Map<Long, Long> followerCounts = counts(userIds, followRepository.countFollowersForUsers(userIds));
        Map<Long, Long> followingCounts = counts(userIds, followRepository.countFollowingForUsers(userIds));
        Page<UserPublicResponseDTO> result = users.map(user -> toPublic(user,
                postCounts.getOrDefault(user.getId(), 0L), commentCounts.getOrDefault(user.getId(), 0L),
                followerCounts.getOrDefault(user.getId(), 0L), followingCounts.getOrDefault(user.getId(), 0L)));
        return PageResponse.from(result);
    }

    @Transactional
    public UserAccountResponseDTO updateOwnProfile(UserProfileUpdateRequestDTO request) {
        User user = authenticatedUserService.getCurrentUser();
        String username = normalizeUsername(request.username());
        String registration = normalizeRegistrationNumber(request.registrationNumber());

        if (userRepository.existsByUsernameIgnoreCaseAndIdNot(username, user.getId())) {
            throw new DuplicateResourceException("O username já está em uso");
        }
        if (registration != null
                && userRepository.existsByRegistrationNumberIgnoreCaseAndIdNot(registration, user.getId())) {
            throw new DuplicateResourceException("A matrícula já está em uso");
        }

        user.updateProfile(
                request.name().trim(),
                username,
                normalizeOptionalText(request.avatarUrl()),
                normalizeOptionalText(request.bio()),
                registration,
                normalizeOptionalText(request.course()),
                request.semester()
        );
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
        authenticatedUserService.requireAnyRole(UserRole.ADMIN);
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
                user.getId(), user.getEmail(), user.getName(), user.getUsername(), user.getAvatarUrl(),
                user.getBio(), user.getRegistrationNumber(), user.getCourse(), user.getSemester(),
                user.getRole(), user.getStatus(), user.isProfileComplete(), user.getOnboardingCompletedAt(),
                user.getCreatedAt(), user.getUpdatedAt()
        );
    }

    public UserSummaryResponseDTO toSummary(User user) {
        return new UserSummaryResponseDTO(user.getId(), user.getName(), user.getUsername(), user.getAvatarUrl());
    }

    private User findAnyUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    private void anonymize(User user) {
        String suffix = user.getId() + "-" + UUID.randomUUID();
        user.anonymize(
                "deleted-" + suffix + "@companion.invalid",
                "deleted" + user.getId() + UUID.randomUUID().toString().replace("-", "").substring(0, 8),
                passwordEncoder.encode(UUID.randomUUID().toString())
        );
        userRepository.save(user);
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
                user.getId(), user.getName(), user.getUsername(), user.getAvatarUrl(), user.getBio(),
                user.getCourse(), user.getSemester(),
                posts, comments, followers, following,
                user.getCreatedAt()
        );
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

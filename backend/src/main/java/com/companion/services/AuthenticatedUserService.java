package com.companion.services;

import com.companion.entities.User;
import com.companion.enums.UserRole;
import com.companion.enums.UserStatus;
import com.companion.exceptions.ForbiddenOperationException;
import com.companion.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Service
public class AuthenticatedUserService {

    private final UserRepository userRepository;

    public AuthenticatedUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            throw new AuthenticationCredentialsNotFoundException("Autenticação necessária");
        }

        Long userId;
        try {
            userId = Long.valueOf(authentication.getName());
        } catch (NumberFormatException exception) {
            throw new AuthenticationCredentialsNotFoundException("Token de autenticação inválido");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException("Usuário autenticado não encontrado"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ForbiddenOperationException("A conta não está ativa");
        }
        return user;
    }

    @Transactional(readOnly = true)
    public User getCurrentUserWithCompleteProfile() {
        User user = getCurrentUser();
        if (!user.isProfileComplete()) {
            throw new ForbiddenOperationException("Conclua o perfil antes de acessar esta funcionalidade");
        }
        return user;
    }

    @Transactional(readOnly = true)
    public User requireAnyRole(UserRole... allowedRoles) {
        User user = getCurrentUser();
        if (Arrays.stream(allowedRoles).noneMatch(role -> role == user.getRole())) {
            throw new ForbiddenOperationException("O usuário não possui permissão para esta operação");
        }
        return user;
    }
}

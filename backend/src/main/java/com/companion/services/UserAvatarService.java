package com.companion.services;

import com.companion.dtos.user.UserAccountResponseDTO;
import com.companion.entities.UserAvatar;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/** Troca, leitura e remoção da foto de perfil, guardada no banco (AvatarImageService). */
@Service
public class UserAvatarService {

    private final AuthenticatedUserService authenticatedUserService;
    private final AvatarImageService avatarImageService;
    private final UserService userService;

    public UserAvatarService(AuthenticatedUserService authenticatedUserService,
                             AvatarImageService avatarImageService,
                             UserService userService) {
        this.authenticatedUserService = authenticatedUserService;
        this.avatarImageService = avatarImageService;
        this.userService = userService;
    }

    public UserAccountResponseDTO uploadOwnAvatar(MultipartFile file) {
        Long userId = authenticatedUserService.getCurrentUser().getId();
        String avatarUrl = avatarImageService.store(userId, file);
        return userService.changeOwnAvatarUrl(avatarUrl);
    }

    public Optional<UserAvatar> findAvatar(Long userId) {
        return avatarImageService.find(userId);
    }

    /** Exclui (anonimiza) a própria conta e apaga a foto guardada. */
    public void deleteOwnAccount() {
        Long userId = authenticatedUserService.getCurrentUser().getId();
        userService.deleteOwnAccount();
        avatarImageService.delete(userId);
    }

    public UserAccountResponseDTO removeOwnAvatar() {
        Long userId = authenticatedUserService.getCurrentUser().getId();
        UserAccountResponseDTO account = userService.changeOwnAvatarUrl(null);
        avatarImageService.delete(userId);
        return account;
    }
}

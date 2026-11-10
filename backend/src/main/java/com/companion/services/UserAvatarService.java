package com.companion.services;

import com.companion.dtos.user.UserAccountResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Troca e remoção da foto de perfil. Fica fora de transação de propósito: o
 * envio ao Cloudinary pode levar alguns segundos e não deve prender uma
 * conexão do banco. Só a gravação do endereço (UserService) é transacional.
 */
@Service
public class UserAvatarService {

    private final AuthenticatedUserService authenticatedUserService;
    private final CloudinaryAvatarService cloudinaryAvatarService;
    private final UserService userService;

    public UserAvatarService(AuthenticatedUserService authenticatedUserService,
                             CloudinaryAvatarService cloudinaryAvatarService,
                             UserService userService) {
        this.authenticatedUserService = authenticatedUserService;
        this.cloudinaryAvatarService = cloudinaryAvatarService;
        this.userService = userService;
    }

    public UserAccountResponseDTO uploadOwnAvatar(MultipartFile file) {
        Long userId = authenticatedUserService.getCurrentUser().getId();
        String avatarUrl = cloudinaryAvatarService.uploadAvatar(userId, file);
        return userService.changeOwnAvatarUrl(avatarUrl);
    }

    /** Exclui (anonimiza) a própria conta e apaga a foto guardada no Cloudinary. */
    public void deleteOwnAccount() {
        Long userId = authenticatedUserService.getCurrentUser().getId();
        userService.deleteOwnAccount();
        cloudinaryAvatarService.deleteAvatar(userId);
    }

    public UserAccountResponseDTO removeOwnAvatar() {
        Long userId = authenticatedUserService.getCurrentUser().getId();
        UserAccountResponseDTO account = userService.changeOwnAvatarUrl(null);
        cloudinaryAvatarService.deleteAvatar(userId);
        return account;
    }
}

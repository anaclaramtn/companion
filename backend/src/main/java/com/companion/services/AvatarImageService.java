package com.companion.services;

import com.companion.entities.UserAvatar;
import com.companion.exceptions.BadRequestException;
import com.companion.repositories.UserAvatarRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

/**
 * Guarda as fotos de perfil no banco (tabela user_avatars). Cada usuário tem
 * uma única imagem; um novo envio substitui a anterior.
 */
@Service
public class AvatarImageService {
    public static final long MAX_FILE_SIZE = 2L * 1024 * 1024;

    private final UserAvatarRepository userAvatarRepository;

    public AvatarImageService(UserAvatarRepository userAvatarRepository) {
        this.userAvatarRepository = userAvatarRepository;
    }

    /** Valida e grava a imagem. Devolve o endereço (GET /api/users/{id}/avatar) para guardar no perfil. */
    @Transactional
    public String store(Long userId, MultipartFile file) {
        byte[] bytes = readValidImage(file);
        String contentType = contentType(bytes);

        UserAvatar avatar = userAvatarRepository.findById(userId).orElse(null);
        if (avatar == null) {
            avatar = new UserAvatar(userId, contentType, bytes);
        } else {
            avatar.replace(contentType, bytes);
        }
        userAvatarRepository.save(avatar);

        // O parâmetro "v" muda a cada envio para o navegador não mostrar a foto antiga em cache.
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/users/{id}/avatar")
                .queryParam("v", System.currentTimeMillis())
                .buildAndExpand(userId)
                .toUriString();
    }

    @Transactional(readOnly = true)
    public Optional<UserAvatar> find(Long userId) {
        return userAvatarRepository.findById(userId);
    }

    @Transactional
    public void delete(Long userId) {
        userAvatarRepository.deleteById(userId);
    }

    /**
     * Confere tamanho e formato. O formato é lido dos primeiros bytes do
     * arquivo, e não do tipo informado pelo navegador, que pode ser forjado.
     */
    private byte[] readValidImage(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new BadRequestException("Selecione uma imagem");
        if (file.getSize() > MAX_FILE_SIZE) throw new BadRequestException("A imagem deve ter até 2 MB");

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException exception) {
            throw new BadRequestException("Não foi possível ler a imagem enviada");
        }
        if (!isJpeg(bytes) && !isPng(bytes) && !isWebp(bytes)) {
            throw new BadRequestException("Use uma imagem JPG, PNG ou WEBP");
        }
        return bytes;
    }

    private static String contentType(byte[] bytes) {
        if (isJpeg(bytes)) return "image/jpeg";
        if (isPng(bytes)) return "image/png";
        return "image/webp";
    }

    private static boolean isJpeg(byte[] b) {
        return startsWith(b, 0, 0xFF, 0xD8, 0xFF);
    }

    private static boolean isPng(byte[] b) {
        return startsWith(b, 0, 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A);
    }

    private static boolean isWebp(byte[] b) {
        return startsWith(b, 0, 'R', 'I', 'F', 'F') && startsWith(b, 8, 'W', 'E', 'B', 'P');
    }

    private static boolean startsWith(byte[] bytes, int offset, int... expected) {
        if (bytes.length < offset + expected.length) return false;
        for (int i = 0; i < expected.length; i++) {
            if ((bytes[offset + i] & 0xFF) != expected[i]) return false;
        }
        return true;
    }
}

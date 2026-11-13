package com.companion.services;

import com.companion.exceptions.BadRequestException;
import com.companion.repositories.UserAvatarRepository;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

class AvatarImageServiceTest {

    private static final byte[] PNG_HEADER = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0, 0};

    // A validação acontece antes de qualquer acesso ao banco.
    private final AvatarImageService service = new AvatarImageService(mock(UserAvatarRepository.class));

    @Test
    void rejectsEmptyFile() {
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> service.store(1L, new MockMultipartFile("file", new byte[0])));
        assertEquals("Selecione uma imagem", exception.getMessage());
    }

    @Test
    void rejectsFileLargerThanTwoMegabytes() {
        byte[] bytes = new byte[(int) AvatarImageService.MAX_FILE_SIZE + 1];
        System.arraycopy(PNG_HEADER, 0, bytes, 0, PNG_HEADER.length);
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> service.store(1L, new MockMultipartFile("file", "foto.png", "image/png", bytes)));
        assertEquals("A imagem deve ter até 2 MB", exception.getMessage());
    }

    @Test
    void rejectsFileThatOnlyClaimsToBeAnImage() {
        MockMultipartFile fake = new MockMultipartFile("file", "foto.png", "image/png",
                "<script>alert(1)</script>".getBytes(StandardCharsets.UTF_8));
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> service.store(1L, fake));
        assertEquals("Use uma imagem JPG, PNG ou WEBP", exception.getMessage());
    }
}

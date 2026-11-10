package com.companion.services;

import com.companion.exceptions.BadRequestException;
import com.companion.exceptions.ServiceUnavailableException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CloudinaryAvatarServiceTest {

    private static final byte[] PNG_HEADER = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0, 0};

    private final CloudinaryAvatarService unconfigured = new CloudinaryAvatarService("", "", "");

    @Test
    void rejectsEmptyFile() {
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> unconfigured.uploadAvatar(1L, new MockMultipartFile("file", new byte[0])));
        assertEquals("Selecione uma imagem", exception.getMessage());
    }

    @Test
    void rejectsFileLargerThanTwoMegabytes() {
        byte[] bytes = new byte[(int) CloudinaryAvatarService.MAX_FILE_SIZE + 1];
        System.arraycopy(PNG_HEADER, 0, bytes, 0, PNG_HEADER.length);
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> unconfigured.uploadAvatar(1L, new MockMultipartFile("file", "foto.png", "image/png", bytes)));
        assertEquals("A imagem deve ter até 2 MB", exception.getMessage());
    }

    @Test
    void rejectsFileThatOnlyClaimsToBeAnImage() {
        MockMultipartFile fake = new MockMultipartFile("file", "foto.png", "image/png",
                "<script>alert(1)</script>".getBytes(StandardCharsets.UTF_8));
        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> unconfigured.uploadAvatar(1L, fake));
        assertEquals("Use uma imagem JPG, PNG ou WEBP", exception.getMessage());
    }

    @Test
    void reportsUnavailableServiceWhenCloudinaryIsNotConfigured() {
        MockMultipartFile png = new MockMultipartFile("file", "foto.png", "image/png", PNG_HEADER);
        assertThrows(ServiceUnavailableException.class, () -> unconfigured.uploadAvatar(1L, png));
    }

    @Test
    void ignoresDeletionWhenCloudinaryIsNotConfigured() {
        assertDoesNotThrow(() -> unconfigured.deleteAvatar(1L));
    }
}

package com.companion.services;

import com.companion.exceptions.BadRequestException;
import com.companion.exceptions.ServiceUnavailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Map;
import java.util.TreeMap;

/**
 * Envia e apaga fotos de perfil no Cloudinary. Cada usuário tem uma única
 * imagem (companion/avatars/user-{id}); um novo envio substitui a anterior.
 */
@Service
public class CloudinaryAvatarService {
    public static final long MAX_FILE_SIZE = 2L * 1024 * 1024;
    static final String UNAVAILABLE_MESSAGE = "O envio de fotos está indisponível no momento. Tente novamente mais tarde.";

    private static final Logger log = LoggerFactory.getLogger(CloudinaryAvatarService.class);
    private static final String API_URL = "https://api.cloudinary.com/v1_1/{cloudName}/image/{action}";

    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;
    private final RestClient restClient = RestClient.create();

    public CloudinaryAvatarService(
            @Value("${cloudinary.cloud-name:}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret) {
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    public String uploadAvatar(Long userId, MultipartFile file) {
        byte[] bytes = readValidImage(file);
        requireConfiguration();

        String publicId = publicId(userId);
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
        parts.add("file", new ByteArrayResource(bytes) {
            @Override
            public String getFilename() {
                return "avatar";
            }
        });
        parts.add("api_key", apiKey);
        parts.add("timestamp", timestamp);
        parts.add("public_id", publicId);
        parts.add("signature", sign(Map.of("public_id", publicId, "timestamp", timestamp)));

        Map<?, ?> response;
        try {
            response = restClient.post()
                    .uri(API_URL, cloudName, "upload")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(parts)
                    .retrieve()
                    .body(Map.class);
        } catch (RestClientResponseException exception) {
            if (exception.getStatusCode().value() == HttpStatus.BAD_REQUEST.value()) {
                // O Cloudinary devolve 400 quando não consegue ler a imagem.
                log.warn("Cloudinary recusou a imagem do usuário {}: {}", userId,
                        exception.getResponseBodyAsString());
                throw new BadRequestException(
                        "Não foi possível processar a imagem. Envie outra foto JPG, PNG ou WEBP.");
            }
            log.error("Cloudinary respondeu {} ao enviar a foto do usuário {}: {}",
                    exception.getStatusCode(), userId, exception.getResponseBodyAsString());
            throw new ServiceUnavailableException(UNAVAILABLE_MESSAGE);
        } catch (RestClientException exception) {
            log.error("Falha ao falar com o Cloudinary ao enviar a foto do usuário {}", userId, exception);
            throw new ServiceUnavailableException(UNAVAILABLE_MESSAGE);
        }

        Object secureUrl = response == null ? null : response.get("secure_url");
        if (!(secureUrl instanceof String url) || url.isBlank()) {
            log.error("Cloudinary não devolveu secure_url para o usuário {}: {}", userId, response);
            throw new ServiceUnavailableException(UNAVAILABLE_MESSAGE);
        }
        return url;
    }

    /** Apaga a imagem no Cloudinary. Falhas só são registradas: a foto já saiu do perfil. */
    public void deleteAvatar(Long userId) {
        if (!isConfigured()) return;

        String publicId = publicId(userId);
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
        parts.add("api_key", apiKey);
        parts.add("timestamp", timestamp);
        parts.add("public_id", publicId);
        parts.add("invalidate", "true");
        parts.add("signature", sign(Map.of("invalidate", "true", "public_id", publicId, "timestamp", timestamp)));
        try {
            restClient.post()
                    .uri(API_URL, cloudName, "destroy")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(parts)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException exception) {
            log.warn("Não foi possível apagar a foto do usuário {} no Cloudinary", userId, exception);
        }
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

    private boolean isConfigured() {
        return !cloudName.isBlank() && !apiKey.isBlank() && !apiSecret.isBlank();
    }

    private void requireConfiguration() {
        if (!isConfigured()) {
            log.error("Cloudinary não configurado: defina CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY "
                    + "e CLOUDINARY_API_SECRET no .env do backend");
            throw new ServiceUnavailableException(UNAVAILABLE_MESSAGE);
        }
    }

    private static String publicId(Long userId) {
        return "companion/avatars/user-" + userId;
    }

    private String sign(Map<String, String> parameters) {
        String canonical = String.join("&", new TreeMap<>(parameters).entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .toList());
        try {
            MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
            byte[] digest = sha1.digest((canonical + apiSecret).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-1 não está disponível", exception);
        }
    }
}

package com.companion.services;

import com.companion.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Map;
import java.util.TreeMap;

@Service
public class CloudinaryAvatarService {
    private static final long MAX_FILE_SIZE = 2L * 1024 * 1024;
    private static final Map<String, String> ACCEPTED_TYPES = Map.of(
            "image/jpeg", "jpg", "image/png", "png", "image/webp", "webp");

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
        validate(file);
        if (cloudName.isBlank() || apiKey.isBlank() || apiSecret.isBlank()) {
            throw new IllegalStateException("Cloudinary não está configurado no ambiente do backend");
        }

        long timestamp = System.currentTimeMillis() / 1000;
        String folder = "companion/avatars";
        String publicId = "user-" + userId;
        String signature = sign(Map.of("folder", folder, "public_id", publicId,
                "timestamp", String.valueOf(timestamp)));

        MultiValueMap<String, Object> parts = new LinkedMultiValueMap<>();
        parts.add("file", new ByteArrayResource(readBytes(file)) {
            @Override
            public String getFilename() {
                return "avatar." + ACCEPTED_TYPES.get(file.getContentType());
            }
        });
        parts.add("api_key", apiKey);
        parts.add("timestamp", String.valueOf(timestamp));
        parts.add("folder", folder);
        parts.add("public_id", publicId);
        parts.add("signature", signature);

        Map<?, ?> response = restClient.post()
                .uri("https://api.cloudinary.com/v1_1/{cloudName}/image/upload", cloudName)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(parts)
                .retrieve()
                .body(Map.class);
        Object secureUrl = response == null ? null : response.get("secure_url");
        if (!(secureUrl instanceof String url) || url.isBlank()) {
            throw new IllegalStateException("Cloudinary não retornou a URL segura da imagem");
        }
        return url;
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new BadRequestException("Selecione uma imagem");
        if (file.getSize() > MAX_FILE_SIZE) throw new BadRequestException("A imagem deve ter até 2 MB");
        if (!ACCEPTED_TYPES.containsKey(file.getContentType())) {
            throw new BadRequestException("Use uma imagem JPG, PNG ou WEBP");
        }
    }

    private byte[] readBytes(MultipartFile file) {
        try {
            return file.getBytes();
        } catch (IOException exception) {
            throw new BadRequestException("Não foi possível ler a imagem enviada");
        }
    }

    private String sign(Map<String, String> parameters) {
        TreeMap<String, String> sorted = new TreeMap<>(parameters);
        String canonical = sorted.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .reduce((left, right) -> left + "&" + right)
                .orElse("");
        try {
            MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
            byte[] digest = sha1.digest((canonical + apiSecret).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-1 não está disponível", exception);
        }
    }
}

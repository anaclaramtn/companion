package com.companion.services;

import com.companion.dtos.auth.PasswordResetConfirmDTO;
import com.companion.dtos.auth.PasswordResetRequestDTO;
import com.companion.entities.PasswordResetToken;
import com.companion.entities.User;
import com.companion.enums.UserStatus;
import com.companion.exceptions.BadRequestException;
import com.companion.exceptions.ConflictException;
import com.companion.repositories.PasswordResetTokenRepository;
import com.companion.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Locale;
import java.util.UUID;

@Service
public class PasswordResetService {
    private static final Logger LOGGER = LoggerFactory.getLogger(PasswordResetService.class);
    public static final String GENERIC_RESPONSE =
            "Se o e-mail estiver cadastrado, as instruções de recuperação serão enviadas";

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetDelivery delivery;
    private final String frontendUrl;

    public PasswordResetService(PasswordResetTokenRepository tokenRepository, UserRepository userRepository,
                                PasswordEncoder passwordEncoder, PasswordResetDelivery delivery,
                                @Value("${companion.frontend-url}") String frontendUrl) {
        this.tokenRepository = tokenRepository; this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder; this.delivery = delivery; this.frontendUrl = frontendUrl;
    }

    @Transactional
    public void request(PasswordResetRequestDTO request) {
        userRepository.findByEmailIgnoreCase(request.email().trim().toLowerCase(Locale.ROOT))
                .filter(user -> user.getStatus() != UserStatus.DELETED)
                .ifPresent(user -> issue(user));
    }

    @Transactional(readOnly = true)
    public void validate(String rawToken) {
        usableToken(rawToken);
    }

    @Transactional
    public void reset(PasswordResetConfirmDTO request) {
        if (!request.password().equals(request.passwordConfirmation())) {
            throw new BadRequestException("As senhas não coincidem");
        }
        PasswordResetToken token = usableToken(request.token());
        token.getUser().updatePassword(passwordEncoder.encode(request.password()));
        token.use();
        userRepository.save(token.getUser());
        tokenRepository.save(token);
    }

    private void issue(User user) {
        LocalDateTime now = LocalDateTime.now();
        tokenRepository.invalidateActiveForUser(user.getId(), now);
        String rawToken = UUID.randomUUID().toString();
        tokenRepository.save(new PasswordResetToken(user, hash(rawToken), now.plusMinutes(15)));
        try {
            delivery.send(user.getEmail(), frontendUrl + "/reset-password?token=" + rawToken);
        } catch (RuntimeException exception) {
            // A resposta da API deve ser indistinguível para e-mails existentes e inexistentes.
            LOGGER.error("Não foi possível entregar uma mensagem de recuperação de senha", exception);
        }
    }

    private PasswordResetToken usableToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) throw new BadRequestException("Token inválido");
        PasswordResetToken token = tokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new BadRequestException("Token inválido"));
        if (token.getUsedAt() != null) throw new ConflictException("O token já foi utilizado");
        if (!token.getExpiresAt().isAfter(LocalDateTime.now())) throw new BadRequestException("O token expirou");
        if (token.getUser().getStatus() == UserStatus.DELETED) throw new BadRequestException("Token inválido");
        return token;
    }

    static String hash(String rawToken) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 indisponível", exception);
        }
    }
}

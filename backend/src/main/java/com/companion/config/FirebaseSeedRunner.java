package com.companion.config;

import com.companion.entities.User;
import com.companion.enums.UserStatus;
import com.companion.firebase.FirebaseGateway;
import com.companion.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Cria no Firebase as contas dos usuários de exemplo, já com o e-mail
 * verificado, para dar para entrar com eles. No primeiro login o backend liga
 * cada uma ao usuário do banco pelo e-mail.
 *
 * Só roda no perfil "seed", depois do FlywaySeedRunner. Use apenas com um
 * projeto Firebase de DESENVOLVIMENTO.
 */
@Component
@Profile("seed")
@Order(101)
public class FirebaseSeedRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(FirebaseSeedRunner.class);
    private static final String SEED_EMAIL_SUFFIX = ".exemplo@edu.unifor.br";

    private final UserRepository userRepository;
    private final FirebaseGateway firebaseGateway;
    private final String seedPassword;

    public FirebaseSeedRunner(UserRepository userRepository, FirebaseGateway firebaseGateway,
                              @Value("${companion.firebase.seed-user-password:}") String seedPassword) {
        this.userRepository = userRepository;
        this.firebaseGateway = firebaseGateway;
        this.seedPassword = seedPassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (seedPassword.isBlank()) {
            log.warn("SEED_USER_PASSWORD não definida: as contas de exemplo não foram criadas no Firebase.");
            return;
        }
        List<User> examples = userRepository.findAll().stream()
                .filter(user -> user.getStatus() == UserStatus.ACTIVE)
                .filter(user -> user.getFirebaseUid() == null)
                .filter(user -> user.getEmail().endsWith(SEED_EMAIL_SUFFIX))
                .toList();
        try {
            long created = examples.stream()
                    .filter(user -> firebaseGateway.createVerifiedUserIfMissing(
                            user.getEmail(), seedPassword, user.getName()))
                    .count();
            log.info("Firebase: {} conta(s) de exemplo criada(s).", created);
        } catch (RuntimeException exception) {
            // Os dados de exemplo continuam no banco; a API sobe mesmo assim.
            log.error("Não foi possível criar as contas de exemplo no Firebase", exception);
        }
    }
}

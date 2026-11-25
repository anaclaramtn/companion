package com.companion.firebase;

import com.companion.exceptions.ServiceUnavailableException;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.AuthErrorCode;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Component;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;

/** FirebaseGateway real, com o Firebase Admin SDK e a chave da conta de serviço. */
@Component
public class AdminSdkFirebaseGateway implements FirebaseGateway {

    private static final Logger log = LoggerFactory.getLogger(AdminSdkFirebaseGateway.class);
    private static final String APP_NAME = "companion";
    private static final String INVALID_LOGIN = "Não foi possível validar o login. Entre novamente.";

    /** Null quando a chave não foi configurada: a API sobe, mas o login fica indisponível. */
    private final FirebaseAuth auth;

    public AdminSdkFirebaseGateway(
            @Value("${companion.firebase.service-account-base64:}") String serviceAccountBase64) {
        if (serviceAccountBase64.isBlank()) {
            log.warn("FIREBASE_SERVICE_ACCOUNT_BASE64 não definida: o login ficará indisponível.");
            auth = null;
        } else {
            auth = FirebaseAuth.getInstance(initializeApp(serviceAccountBase64.trim()));
        }
    }

    private static synchronized FirebaseApp initializeApp(String serviceAccountBase64) {
        for (FirebaseApp app : FirebaseApp.getApps()) {
            if (APP_NAME.equals(app.getName())) {
                return app;
            }
        }
        try {
            byte[] json = Base64.getDecoder().decode(serviceAccountBase64);
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(new ByteArrayInputStream(json)))
                    .build();
            return FirebaseApp.initializeApp(options, APP_NAME);
        } catch (IOException | IllegalArgumentException exception) {
            // Sem a causa, para nunca escrever trechos da chave no log.
            throw new IllegalStateException(
                    "FIREBASE_SERVICE_ACCOUNT_BASE64 inválida: use o JSON da conta de serviço em Base64");
        }
    }

    @Override
    public FirebaseIdentity verify(String idToken) {
        try {
            // true: também recusa sessões revogadas e contas desativadas no Firebase.
            FirebaseToken token = client().verifyIdToken(idToken, true);
            return new FirebaseIdentity(token.getUid(), token.getEmail(), token.isEmailVerified());
        } catch (FirebaseAuthException exception) {
            if (isInvalidSession(exception.getAuthErrorCode())) {
                throw new BadCredentialsException(INVALID_LOGIN);
            }
            log.error("Falha ao validar o token no Firebase", exception);
            throw new ServiceUnavailableException("O serviço de login está indisponível. Tente novamente.");
        } catch (IllegalArgumentException exception) {
            throw new BadCredentialsException(INVALID_LOGIN);
        }
    }

    private static boolean isInvalidSession(AuthErrorCode code) {
        return code == AuthErrorCode.INVALID_ID_TOKEN
                || code == AuthErrorCode.EXPIRED_ID_TOKEN
                || code == AuthErrorCode.REVOKED_ID_TOKEN
                || code == AuthErrorCode.USER_DISABLED
                || code == AuthErrorCode.USER_NOT_FOUND;
    }

    @Override
    public void deleteUser(String uid) {
        try {
            client().deleteUser(uid);
        } catch (FirebaseAuthException exception) {
            if (exception.getAuthErrorCode() != AuthErrorCode.USER_NOT_FOUND) {
                throw new IllegalStateException("Não foi possível excluir a conta no Firebase", exception);
            }
        }
    }

    @Override
    public boolean createVerifiedUserIfMissing(String email, String password, String displayName) {
        try {
            client().getUserByEmail(email);
            return false;
        } catch (FirebaseAuthException exception) {
            if (exception.getAuthErrorCode() != AuthErrorCode.USER_NOT_FOUND) {
                throw new IllegalStateException("Não foi possível consultar o Firebase", exception);
            }
        }
        UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                .setEmail(email)
                .setEmailVerified(true)
                .setPassword(password);
        if (displayName != null && !displayName.isBlank()) {
            request.setDisplayName(displayName);
        }
        try {
            client().createUser(request);
            return true;
        } catch (FirebaseAuthException exception) {
            throw new IllegalStateException("Não foi possível criar a conta no Firebase", exception);
        }
    }

    private FirebaseAuth client() {
        if (auth == null) {
            throw new ServiceUnavailableException("O login não está configurado no servidor.");
        }
        return auth;
    }
}

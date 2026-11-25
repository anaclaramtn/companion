package com.companion.services;

import com.companion.dtos.auth.AuthResponseDTO;
import com.companion.dtos.auth.FirebaseLoginRequestDTO;
import com.companion.entities.User;
import com.companion.firebase.FirebaseGateway;
import com.companion.firebase.FirebaseIdentity;
import com.companion.security.JwtService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final FirebaseGateway firebaseGateway;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthService(FirebaseGateway firebaseGateway, JwtService jwtService, UserService userService) {
        this.firebaseGateway = firebaseGateway;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    /** Troca o ID token do Firebase pelo token do Companion. */
    public AuthResponseDTO loginWithFirebase(FirebaseLoginRequestDTO request) {
        // A chamada ao Firebase fica fora da transação do banco.
        FirebaseIdentity identity = firebaseGateway.verify(request.idToken());
        User user = userService.signInWithFirebase(identity, Boolean.TRUE.equals(request.acceptedTerms()));
        return new AuthResponseDTO(jwtService.generate(user), "Bearer", jwtService.expiresInSeconds(),
                userService.accountOf(user.getId()));
    }
}

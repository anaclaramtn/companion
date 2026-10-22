package com.companion.services;

import com.companion.dtos.auth.AuthResponseDTO;
import com.companion.dtos.auth.LoginRequestDTO;
import com.companion.dtos.user.UserRegistrationRequestDTO;
import com.companion.entities.User;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.UserRepository;
import com.companion.security.CompanionUserPrincipal;
import com.companion.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authenticationManager, JwtService jwtService,
                       UserService userService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @Transactional
    public AuthResponseDTO register(UserRegistrationRequestDTO request) {
        return response(userService.register(request));
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO request) {
        CompanionUserPrincipal principal = (CompanionUserPrincipal) authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.identifier(), request.password())
        ).getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return response(user);
    }

    private AuthResponseDTO response(User user) {
        return new AuthResponseDTO(jwtService.generate(user), "Bearer", jwtService.expiresInSeconds(),
                userService.toAccount(user));
    }
}

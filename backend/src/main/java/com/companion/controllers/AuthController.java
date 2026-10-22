package com.companion.controllers;

import com.companion.dtos.auth.AuthResponseDTO;
import com.companion.dtos.auth.LoginRequestDTO;
import com.companion.dtos.user.UserRegistrationRequestDTO;
import com.companion.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody UserRegistrationRequestDTO request) {
        AuthResponseDTO response = authService.register(request);
        return ResponseEntity.created(URI.create("/api/users/" + response.user().id())).body(response);
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@Valid @RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }
}

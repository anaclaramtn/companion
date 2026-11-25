package com.companion.controllers;

import com.companion.dtos.auth.AuthResponseDTO;
import com.companion.dtos.auth.FirebaseLoginRequestDTO;
import com.companion.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) { this.authService = authService; }

    /** Login e primeiro acesso de quem se autenticou no Firebase. */
    @PostMapping("/firebase")
    public AuthResponseDTO loginWithFirebase(@Valid @RequestBody FirebaseLoginRequestDTO request) {
        return authService.loginWithFirebase(request);
    }
}

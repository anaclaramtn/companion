package com.companion.controllers;

import com.companion.dtos.auth.PasswordResetConfirmDTO;
import com.companion.dtos.auth.PasswordResetRequestDTO;
import com.companion.dtos.common.MessageResponseDTO;
import com.companion.services.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/password")
public class PasswordResetController {
    private final PasswordResetService service;
    public PasswordResetController(PasswordResetService service) { this.service = service; }

    @PostMapping("/forgot")
    public MessageResponseDTO forgot(@Valid @RequestBody PasswordResetRequestDTO request) {
        service.request(request);
        return new MessageResponseDTO(PasswordResetService.GENERIC_RESPONSE);
    }

    @GetMapping("/reset/validate")
    public MessageResponseDTO validate(@RequestParam String token) {
        service.validate(token);
        return new MessageResponseDTO("Token válido");
    }

    @PostMapping("/reset")
    public MessageResponseDTO reset(@Valid @RequestBody PasswordResetConfirmDTO request) {
        service.reset(request);
        return new MessageResponseDTO("Senha redefinida com sucesso");
    }
}

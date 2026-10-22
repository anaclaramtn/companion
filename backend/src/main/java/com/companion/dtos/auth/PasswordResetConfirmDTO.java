package com.companion.dtos.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PasswordResetConfirmDTO(
        @NotBlank(message = "O token é obrigatório") String token,
        @NotBlank(message = "A nova senha é obrigatória")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,72}$",
                message = "A senha deve ter de 8 a 72 caracteres e incluir letra maiúscula, minúscula e número")
        String password,
        @NotBlank(message = "A confirmação da senha é obrigatória") String passwordConfirmation
) {
}

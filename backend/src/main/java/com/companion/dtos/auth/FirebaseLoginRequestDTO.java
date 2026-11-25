package com.companion.dtos.auth;

import jakarta.validation.constraints.NotBlank;

public record FirebaseLoginRequestDTO(
        @NotBlank(message = "O token de login é obrigatório")
        String idToken,
        // Só é exigido no primeiro acesso, quando a conta é criada.
        Boolean acceptedTerms
) {
}

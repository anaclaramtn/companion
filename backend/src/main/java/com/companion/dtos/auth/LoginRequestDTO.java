package com.companion.dtos.auth;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @NotBlank(message = "Informe o e-mail ou username") String identifier,
        @NotBlank(message = "A senha é obrigatória") String password
) {
}

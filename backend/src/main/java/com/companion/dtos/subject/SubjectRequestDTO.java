package com.companion.dtos.subject;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SubjectRequestDTO(
        @NotNull(message = "A universidade é obrigatória")
        Long universityId,
        @NotBlank(message = "O código da matéria é obrigatório")
        @Size(max = 10, message = "O código deve ter no máximo 10 caracteres")
        String code,
        @NotBlank(message = "O nome da matéria é obrigatório")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        String name
) {
}

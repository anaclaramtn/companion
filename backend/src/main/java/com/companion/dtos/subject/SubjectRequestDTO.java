package com.companion.dtos.subject;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubjectRequestDTO(
        @NotBlank(message = "O nome da matéria é obrigatório")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        String name
) {
}

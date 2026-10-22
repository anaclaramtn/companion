package com.companion.dtos.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PostCreateRequestDTO(
        @NotNull(message = "A matéria é obrigatória") Long subjectId,
        @NotBlank(message = "O título é obrigatório")
        @Size(max = 160, message = "O título deve ter no máximo 160 caracteres") String title,
        @NotBlank(message = "O conteúdo é obrigatório")
        @Size(max = 300, message = "O conteúdo deve ter no máximo 300 caracteres") String content
) {
}

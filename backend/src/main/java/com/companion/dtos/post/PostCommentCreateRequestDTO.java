package com.companion.dtos.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostCommentCreateRequestDTO(
        @NotBlank(message = "A resposta é obrigatória")
        @Size(max = 300, message = "A resposta deve ter no máximo 300 caracteres")
        String content
) {
}

package com.companion.dtos.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PostCreateRequestDTO(
        @NotEmpty(message = "Selecione pelo menos 1 matéria")
        @Size(max = 3, message = "Selecione no máximo 3 matérias")
        List<@NotNull(message = "A matéria é obrigatória") Long> subjectIds,
        @NotBlank(message = "O título é obrigatório")
        @Size(max = 128, message = "O título deve ter no máximo 128 caracteres") String title,
        @NotBlank(message = "O conteúdo é obrigatório")
        @Size(max = 256, message = "O conteúdo deve ter no máximo 256 caracteres") String content
) {
}

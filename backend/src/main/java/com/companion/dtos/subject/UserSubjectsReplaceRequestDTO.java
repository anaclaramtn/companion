package com.companion.dtos.subject;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/** Lista completa das matérias do perfil; o que ficar de fora é removido. */
public record UserSubjectsReplaceRequestDTO(
        @NotNull(message = "Envie a lista de matérias")
        @Size(max = 10, message = "Escolha no máximo 10 matérias")
        List<@Valid @NotNull UserSubjectRequestDTO> subjects
) {
}

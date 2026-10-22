package com.companion.dtos.faq;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FaqRequestDTO(
        @NotBlank(message = "A pergunta é obrigatória") @Size(max = 255) String question,
        @NotBlank(message = "A resposta é obrigatória") @Size(max = 20000) String answer,
        @NotNull(message = "A ordem é obrigatória") @Min(0) Integer displayOrder,
        @NotNull(message = "O estado ativo é obrigatório") Boolean active
) {
}

package com.companion.dtos.report;

import com.companion.enums.ReportReason;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReportCreateRequestDTO(
        Long postId,
        Long postCommentId,
        @NotNull(message = "O motivo é obrigatório") ReportReason reason,
        @Size(max = 500, message = "Os detalhes devem ter no máximo 500 caracteres") String details
) {
}

package com.companion.dtos.report;

import com.companion.enums.ReportStatus;
import jakarta.validation.constraints.NotNull;

public record ReportReviewRequestDTO(@NotNull(message = "O estado é obrigatório") ReportStatus status) {
}

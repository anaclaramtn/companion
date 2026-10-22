package com.companion.dtos.report;

import com.companion.dtos.user.UserSummaryResponseDTO;
import com.companion.enums.ReportReason;
import com.companion.enums.ReportStatus;

import java.time.LocalDateTime;

public record ReportResponseDTO(
        Long id,
        UserSummaryResponseDTO reporter,
        UserSummaryResponseDTO reviewedBy,
        String targetType,
        Long targetId,
        Long postId,
        String targetPreview,
        ReportReason reason,
        String details,
        ReportStatus status,
        LocalDateTime createdAt,
        LocalDateTime reviewedAt
) {
}

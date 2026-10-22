package com.companion.dtos.faq;

import java.time.LocalDateTime;

public record FaqResponseDTO(Long id, String question, String answer, Integer displayOrder, boolean active,
                             LocalDateTime createdAt, LocalDateTime updatedAt) {
}

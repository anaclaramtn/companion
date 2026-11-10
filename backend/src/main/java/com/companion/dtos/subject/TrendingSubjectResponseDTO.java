package com.companion.dtos.subject;

// Matéria em alta: quantas dúvidas citaram a matéria no período.
public record TrendingSubjectResponseDTO(Long id, String code, String name, long postCount) {
}

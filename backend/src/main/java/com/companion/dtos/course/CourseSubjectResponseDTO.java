package com.companion.dtos.course;

// Disciplina da grade do curso. semester = 0 indica optativa.
public record CourseSubjectResponseDTO(Long id, String code, String name, Integer semester) {
}

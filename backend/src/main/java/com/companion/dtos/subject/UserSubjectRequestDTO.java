package com.companion.dtos.subject;

import com.companion.enums.Proficiency;
import com.companion.enums.SubjectInterestType;
import jakarta.validation.constraints.NotNull;

public record UserSubjectRequestDTO(
        @NotNull(message = "A matéria é obrigatória") Long subjectId,
        @NotNull(message = "A classificação é obrigatória") SubjectInterestType interestType,
        @NotNull(message = "A proficiência é obrigatória") Proficiency proficiency
) {
}

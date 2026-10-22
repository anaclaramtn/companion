package com.companion.dtos.subject;

import com.companion.enums.Proficiency;
import com.companion.enums.SubjectInterestType;

public record UserSubjectResponseDTO(
        Long id,
        SubjectResponseDTO subject,
        SubjectInterestType interestType,
        Proficiency proficiency
) {
}

package com.companion.dtos.user;

import jakarta.validation.constraints.*;

public record UserProfileUpdateRequestDTO(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 64, message = "O nome deve ter no máximo 64 caracteres")
        String name,
        @NotBlank(message = "O username é obrigatório")
        @Pattern(regexp = "^@?[A-Za-z0-9]{3,30}$", message = "O username deve ter de 3 a 30 letras ou números")
        String username,
        @Size(max = 500, message = "A URL do avatar deve ter no máximo 500 caracteres")
        String avatarUrl,
        @Size(max = 512, message = "A biografia deve ter no máximo 512 caracteres")
        String bio,
        @Size(max = 30, message = "A matrícula deve ter no máximo 30 caracteres")
        String registrationNumber,
        Long courseId,
        @Min(value = 1, message = "O semestre deve ser maior ou igual a 1")
        Integer semester
) {
}

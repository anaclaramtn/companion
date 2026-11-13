package com.companion.dtos.user;

import jakarta.validation.constraints.*;

/**
 * Atualização parcial do perfil: campo ausente (null) mantém o valor atual.
 * Para limpar a biografia ou a matrícula, envie texto vazio. A foto de perfil
 * não passa por aqui: use PUT e DELETE em /api/users/me/avatar.
 */
public record UserProfileUpdateRequestDTO(
        @Pattern(regexp = "(?s).*\\S.*", message = "O nome não pode ficar em branco")
        @Size(max = 64, message = "O nome deve ter no máximo 64 caracteres")
        String name,
        @Pattern(regexp = "^@?[A-Za-z0-9]{3,30}$", message = "O username deve ter de 3 a 30 letras ou números")
        String username,
        @Size(max = 512, message = "A biografia deve ter no máximo 512 caracteres")
        String bio,
        @Size(max = 30, message = "A matrícula deve ter no máximo 30 caracteres")
        String registrationNumber,
        Long courseId,
        @Min(value = 1, message = "O semestre deve ser maior ou igual a 1")
        Integer semester,
        @Pattern(regexp = "GRADIENT|WAVES|WAVES_2|WAVES_3|SOLID", message = "Estilo de banner inválido")
        String bannerStyle,
        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "A cor do banner deve estar no formato #rrggbb")
        String bannerColor
) {
}

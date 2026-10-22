package com.companion.dtos.user;

import com.companion.enums.UserRole;
import jakarta.validation.constraints.NotNull;

public record UserRoleUpdateRequestDTO(@NotNull(message = "O papel é obrigatório") UserRole role) {
}

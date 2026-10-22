package com.companion.dtos.user;

import com.companion.enums.UserStatus;
import jakarta.validation.constraints.NotNull;

public record UserStatusUpdateRequestDTO(@NotNull(message = "O status é obrigatório") UserStatus status) {
}

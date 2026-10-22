package com.companion.dtos.auth;

import com.companion.dtos.user.UserAccountResponseDTO;

public record AuthResponseDTO(String accessToken, String tokenType, long expiresIn, UserAccountResponseDTO user) {
}

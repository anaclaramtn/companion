package com.companion.dtos.user;

import java.util.List;

/** Resultado da busca de estudantes: quem é e as matérias que domina. */
public record UserSearchResultDTO(
        Long id,
        String name,
        String username,
        String avatarUrl,
        String course,
        List<String> dominatedSubjects
) {
}

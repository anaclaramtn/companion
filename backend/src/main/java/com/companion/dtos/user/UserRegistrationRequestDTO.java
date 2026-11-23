package com.companion.dtos.user;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegistrationRequestDTO(
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Informe um e-mail válido")
        @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres")
        String email,
        @NotBlank(message = "A senha é obrigatória")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,72}$",
                message = "A senha deve ter de 8 a 72 caracteres e incluir letra maiúscula, minúscula e número")
        String password,
        // Boolean (e não boolean) para um campo ausente cair na mesma validação de "não aceitou".
        @NotNull(message = "É preciso aceitar os Termos e a Política de Privacidade")
        @AssertTrue(message = "É preciso aceitar os Termos e a Política de Privacidade")
        Boolean acceptedTerms
) {
}

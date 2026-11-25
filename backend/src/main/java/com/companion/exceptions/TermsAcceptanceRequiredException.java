package com.companion.exceptions;

/** Primeiro acesso: a conta só é criada depois do aceite dos termos (HTTP 428). */
public class TermsAcceptanceRequiredException extends RuntimeException {
    public TermsAcceptanceRequiredException() {
        super("É preciso aceitar os Termos e a Política de Privacidade");
    }
}

package com.companion.exceptions;

/** Um serviço externo está fora do ar ou sem configuração. */
public class ServiceUnavailableException extends RuntimeException {
    public ServiceUnavailableException(String message) {
        super(message);
    }
}

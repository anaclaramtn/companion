package com.companion.exceptions;

public class DuplicateResourceException extends ConflictException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}

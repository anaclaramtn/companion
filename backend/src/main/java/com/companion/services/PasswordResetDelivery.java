package com.companion.services;

public interface PasswordResetDelivery {
    void send(String email, String resetLink);
}

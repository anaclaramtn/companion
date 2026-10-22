package com.companion.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("dev")
public class DevPasswordResetDelivery implements PasswordResetDelivery {
    private static final Logger LOGGER = LoggerFactory.getLogger(DevPasswordResetDelivery.class);

    @Override
    public void send(String email, String resetLink) {
        LOGGER.info("Link local de redefinição para {}: {}", email, resetLink);
    }
}

package com.companion.services;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
@Profile("!dev")
public class MailPasswordResetDelivery implements PasswordResetDelivery {
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    public MailPasswordResetDelivery(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    @Override
    public void send(String email, String resetLink) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            throw new IllegalStateException("O serviço de e-mail não está configurado");
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Redefinição de senha — Companion");
        message.setText("Use o link abaixo nos próximos 15 minutos para redefinir sua senha:\n\n" + resetLink);
        mailSender.send(message);
    }
}

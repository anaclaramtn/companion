package com.companion.security;

import com.companion.entities.User;
import com.companion.enums.UserStatus;
import com.companion.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class CompanionUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CompanionUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        String normalized = identifier.trim().toLowerCase(Locale.ROOT).replaceFirst("^@", "");
        User user = userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase(normalized, normalized)
                .filter(found -> found.getStatus() == UserStatus.ACTIVE)
                .orElseThrow(() -> new UsernameNotFoundException("Credenciais inválidas"));
        return new CompanionUserPrincipal(user);
    }
}

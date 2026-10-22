package com.companion.services;

import com.companion.dtos.user.UserRegistrationRequestDTO;
import com.companion.exceptions.DuplicateResourceException;
import com.companion.repositories.FollowRepository;
import com.companion.repositories.PostCommentRepository;
import com.companion.repositories.PostRepository;
import com.companion.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock AuthenticatedUserService authenticatedUserService;
    @Mock PostRepository postRepository;
    @Mock PostCommentRepository commentRepository;
    @Mock FollowRepository followRepository;

    @Test
    void rejectsCaseInsensitiveDuplicateEmailBeforeEncodingPassword() {
        when(userRepository.existsByEmailIgnoreCase("ana@unifor.br")).thenReturn(true);
        UserService service = new UserService(userRepository, passwordEncoder, authenticatedUserService,
                postRepository, commentRepository, followRepository);

        assertThrows(DuplicateResourceException.class, () -> service.register(
                new UserRegistrationRequestDTO("ANA@UNIFOR.BR", "Senha123")));
        verifyNoInteractions(passwordEncoder);
    }
}

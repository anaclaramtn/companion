package com.companion.services;

import com.companion.exceptions.ForbiddenOperationException;
import com.companion.exceptions.TermsAcceptanceRequiredException;
import com.companion.firebase.FirebaseIdentity;
import com.companion.repositories.CourseRepository;
import com.companion.repositories.FollowRepository;
import com.companion.repositories.PostCommentRepository;
import com.companion.repositories.PostRepository;
import com.companion.repositories.UserRepository;
import com.companion.repositories.UserSubjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    @Mock UserRepository userRepository;
    @Mock ApplicationEventPublisher eventPublisher;
    @Mock AuthenticatedUserService authenticatedUserService;
    @Mock PostRepository postRepository;
    @Mock PostCommentRepository commentRepository;
    @Mock FollowRepository followRepository;
    @Mock CourseRepository courseRepository;
    @Mock UserSubjectRepository userSubjectRepository;
    @InjectMocks UserService service;

    @Test
    void doesNotCreateAnAccountWithoutAcceptingTheTerms() {
        assertThrows(TermsAcceptanceRequiredException.class, () -> service.signInWithFirebase(
                new FirebaseIdentity("uid", "ana@edu.unifor.br", true), false));
        verify(userRepository, never()).save(any());
    }

    @Test
    void rejectsNonInstitutionalEmailBeforeReadingTheDatabase() {
        assertThrows(ForbiddenOperationException.class, () -> service.signInWithFirebase(
                new FirebaseIdentity("uid", "ana@gmail.com", true), true));
        verifyNoInteractions(userRepository);
    }
}

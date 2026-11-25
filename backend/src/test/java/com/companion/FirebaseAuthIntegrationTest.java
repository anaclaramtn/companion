package com.companion;

import com.companion.entities.User;
import com.companion.enums.UserStatus;
import com.companion.firebase.FirebaseGateway;
import com.companion.firebase.FirebaseIdentity;
import com.companion.repositories.UserRepository;
import com.companion.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class FirebaseAuthIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;
    @MockitoBean FirebaseGateway firebase;

    private void firebaseReturns(String token, String uid, String email, boolean verified) {
        when(firebase.verify(token)).thenReturn(new FirebaseIdentity(uid, email, verified));
    }

    @Test
    void rejectsAnInvalidToken() throws Exception {
        when(firebase.verify("ruim")).thenThrow(new BadCredentialsException("Login inválido"));

        FakeFirebase.signIn(mockMvc, "ruim", true)
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Login inválido"));
    }

    @Test
    void requiresTheTokenInTheRequest() throws Exception {
        mockMvc.perform(post("/api/auth/firebase").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.idToken").exists());
    }

    @Test
    void rejectsUnverifiedAndNonInstitutionalEmails() throws Exception {
        firebaseReturns("sem-verificar", "uid-a", "pendente@edu.unifor.br", false);
        firebaseReturns("gmail", "uid-b", "pessoa@gmail.com", true);
        firebaseReturns("parecido", "uid-c", "pessoa@edu.unifor.br.exemplo.com", true);

        for (String token : new String[]{"sem-verificar", "gmail", "parecido"}) {
            FakeFirebase.signIn(mockMvc, token, true).andExpect(status().isForbidden());
        }
        assertTrue(userRepository.findByEmailIgnoreCase("pendente@edu.unifor.br").isEmpty());
        assertTrue(userRepository.findByEmailIgnoreCase("pessoa@gmail.com").isEmpty());
    }

    @Test
    void createsTheAccountOnlyAfterTheTermsAreAccepted() throws Exception {
        firebaseReturns("nova", "uid-nova", "Nova@edu.unifor.br", true);

        FakeFirebase.signIn(mockMvc, "nova", false).andExpect(status().isPreconditionRequired());
        assertTrue(userRepository.findByEmailIgnoreCase("nova@edu.unifor.br").isEmpty());

        FakeFirebase.signIn(mockMvc, "nova", true)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isString())
                .andExpect(jsonPath("$.user.email").value("nova@edu.unifor.br"))
                .andExpect(jsonPath("$.user.role").value("USER"))
                .andExpect(jsonPath("$.user.profileComplete").value(false))
                .andExpect(jsonPath("$.user.firebaseUid").doesNotExist());

        User user = userRepository.findByEmailIgnoreCase("nova@edu.unifor.br").orElseThrow();
        assertEquals("uid-nova", user.getFirebaseUid());
        assertEquals(UserService.TERMS_VERSION, user.getTermsVersion());
        assertNotNull(user.getTermsAcceptedAt());
        assertNotNull(user.getEmailVerifiedAt());

        // Nos próximos acessos não precisa aceitar de novo nem cria outra conta.
        long total = userRepository.count();
        FakeFirebase.signIn(mockMvc, "nova", false)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.id").value(user.getId()));
        assertEquals(total, userRepository.count());
    }

    @Test
    void linksAnExistingUserByEmailAndRefusesAnotherUid() throws Exception {
        User seeded = userRepository.saveAndFlush(new User("semeado@edu.unifor.br"));
        firebaseReturns("primeiro", "uid-1", "semeado@edu.unifor.br", true);
        firebaseReturns("outro", "uid-2", "semeado@edu.unifor.br", true);

        FakeFirebase.signIn(mockMvc, "primeiro", false)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.id").value(seeded.getId()));
        FakeFirebase.signIn(mockMvc, "outro", true).andExpect(status().isConflict());

        assertEquals("uid-1", userRepository.findById(seeded.getId()).orElseThrow().getFirebaseUid());
    }

    @Test
    void blocksSuspendedUsersWithoutLinkingThem() throws Exception {
        User suspended = new User("suspenso@edu.unifor.br");
        suspended.changeStatus(UserStatus.SUSPENDED);
        suspended = userRepository.saveAndFlush(suspended);
        firebaseReturns("suspenso", "uid-s", "suspenso@edu.unifor.br", true);

        FakeFirebase.signIn(mockMvc, "suspenso", true).andExpect(status().isForbidden());

        assertNull(userRepository.findById(suspended.getId()).orElseThrow().getFirebaseUid());
    }

    @Test
    void deletingTheAccountAlsoDeletesItInFirebase() throws Exception {
        FakeFirebase.acceptVerifiedTokens(firebase);
        String token = FakeFirebase.accessToken(mockMvc, "sair@edu.unifor.br");
        long id = userRepository.findByEmailIgnoreCase("sair@edu.unifor.br").orElseThrow().getId();
        verify(firebase, never()).deleteUser("uid-sair@edu.unifor.br");

        mockMvc.perform(delete("/api/users/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        verify(firebase).deleteUser("uid-sair@edu.unifor.br");
        User deleted = userRepository.findById(id).orElseThrow();
        assertEquals(UserStatus.DELETED, deleted.getStatus());
        assertNull(deleted.getFirebaseUid());
        assertNull(deleted.getEmailVerifiedAt());
    }

    @Test
    void keepsTheAccountDeletedWhenFirebaseFails() throws Exception {
        FakeFirebase.acceptVerifiedTokens(firebase);
        String token = FakeFirebase.accessToken(mockMvc, "falha@edu.unifor.br");
        long id = userRepository.findByEmailIgnoreCase("falha@edu.unifor.br").orElseThrow().getId();
        doThrow(new IllegalStateException("Firebase fora do ar"))
                .when(firebase).deleteUser("uid-falha@edu.unifor.br");

        mockMvc.perform(delete("/api/users/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        assertEquals(UserStatus.DELETED, userRepository.findById(id).orElseThrow().getStatus());
    }
}

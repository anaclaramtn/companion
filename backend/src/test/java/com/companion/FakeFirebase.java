package com.companion;

import com.companion.firebase.FirebaseGateway;
import com.companion.firebase.FirebaseIdentity;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doAnswer;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Faz o mock do FirebaseGateway aceitar o ID token "verificado:e-mail", como se
 * o Firebase tivesse autenticado essa pessoa com o e-mail já confirmado.
 */
final class FakeFirebase {

    private static final String PREFIX = "verificado:";

    private FakeFirebase() {
    }

    static void acceptVerifiedTokens(FirebaseGateway gateway) {
        doAnswer(invocation -> {
            String email = invocation.<String>getArgument(0).substring(PREFIX.length());
            return new FirebaseIdentity("uid-" + email.toLowerCase(), email, true);
        }).when(gateway).verify(anyString());
    }

    static ResultActions signIn(MockMvc mockMvc, String idToken, boolean acceptedTerms) throws Exception {
        return mockMvc.perform(post("/api/auth/firebase").contentType(MediaType.APPLICATION_JSON)
                .content("{\"idToken\":\"" + idToken + "\",\"acceptedTerms\":" + acceptedTerms + "}"));
    }

    /** Entra (criando a conta no primeiro acesso) e devolve o token do Companion. */
    static String accessToken(MockMvc mockMvc, String email) throws Exception {
        return signIn(mockMvc, PREFIX + email, true)
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString()
                .replaceAll(".*\"accessToken\":\"([^\"]+)\".*", "$1");
    }
}

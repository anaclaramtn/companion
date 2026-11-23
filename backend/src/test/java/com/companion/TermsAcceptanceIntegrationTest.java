package com.companion;

import com.companion.entities.User;
import com.companion.repositories.UserRepository;
import com.companion.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class TermsAcceptanceIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;

    @Test
    void registrationRecordsWhichTermsVersionWasAcceptedAndWhen() throws Exception {
        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"termos-ok@edu.unifor.br\",\"password\":\"Senha123\",\"acceptedTerms\":true}"))
                .andExpect(status().isCreated());

        User user = userRepository.findByEmailIgnoreCase("termos-ok@edu.unifor.br").orElseThrow();
        assertEquals(UserService.TERMS_VERSION, user.getTermsVersion());
        assertNotNull(user.getTermsAcceptedAt());
    }

    @Test
    void registrationWithoutAcceptingTheTermsIsRejected() throws Exception {
        String refused = "{\"email\":\"termos-no@edu.unifor.br\",\"password\":\"Senha123\",\"acceptedTerms\":false}";
        String missing = "{\"email\":\"termos-no@edu.unifor.br\",\"password\":\"Senha123\"}";

        for (String body : new String[]{refused, missing}) {
            mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors.acceptedTerms")
                            .value("É preciso aceitar os Termos e a Política de Privacidade"));
        }
        assertTrue(userRepository.findByEmailIgnoreCase("termos-no@edu.unifor.br").isEmpty());
    }
}

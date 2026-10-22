package com.companion;

import com.companion.entities.PasswordResetToken;
import com.companion.entities.User;
import com.companion.enums.UserRole;
import com.companion.repositories.PasswordResetTokenRepository;
import com.companion.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CompanionApiIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;
    @Autowired PasswordResetTokenRepository tokenRepository;

    @Test
    void executesCriticalCrudAndSecurityFlows() throws Exception {
        String firstToken = register("ana@unifor.br", "Senha123");

        mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(registrationJson("ANA@unifor.br", "Senha123")))
                .andExpect(status().isConflict());

        mockMvc.perform(put("/api/users/me/profile").header("Authorization", bearer(firstToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(profileJson("Ana Clara", "anaclara")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profileComplete").value(true))
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
        mockMvc.perform(get("/api/users/{id}", userRepository.findByEmailIgnoreCase("ana@unifor.br").orElseThrow().getId())
                        .header("Authorization", bearer(firstToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").doesNotExist())
                .andExpect(jsonPath("$.registrationNumber").doesNotExist());

        User admin = userRepository.findByEmailIgnoreCase("ana@unifor.br").orElseThrow();
        admin.changeRole(UserRole.ADMIN);
        userRepository.saveAndFlush(admin);
        String adminToken = login("anaclara", "Senha123");

        long subjectId = extractId(mockMvc.perform(post("/api/subjects")
                        .header("Authorization", bearer(adminToken)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Algoritmos\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString());

        mockMvc.perform(post("/api/subjects").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"ALGORITMOS\"}"))
                .andExpect(status().isConflict());

        mockMvc.perform(post("/api/users/me/subjects").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subjectId\":" + subjectId + ",\"interestType\":\"DOMINA\",\"proficiency\":\"AVANCADO\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.subject.name").value("Algoritmos"));
        mockMvc.perform(put("/api/users/me/subjects/{id}", subjectId).header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"interestType\":\"QUER_APRENDER\",\"proficiency\":\"INTERMEDIARIO\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.proficiency").value("INTERMEDIARIO"));

        long postId = extractId(mockMvc.perform(post("/api/posts").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subjectId\":" + subjectId + ",\"title\":\"Complexidade\",\"content\":\"Como analisar este algoritmo?\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString());
        mockMvc.perform(post("/api/posts").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subjectId\":" + subjectId + ",\"title\":\"Limite\",\"content\":\"" + "x".repeat(301) + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.content").value("O conteúdo deve ter no máximo 300 caracteres"));
        mockMvc.perform(get("/api/posts").header("Authorization", bearer(adminToken))
                        .param("query", "algoritmo").param("subjectId", String.valueOf(subjectId)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content", hasSize(1)));
        mockMvc.perform(get("/api/users").header("Authorization", bearer(adminToken))
                        .param("query", "Algoritmos"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content", hasSize(1)));

        String secondToken = register("bruno@unifor.br", "Senha123");
        mockMvc.perform(put("/api/users/me/profile").header("Authorization", bearer(secondToken))
                        .contentType(MediaType.APPLICATION_JSON).content(profileJson("Bruno", "bruno")))
                .andExpect(status().isOk());
        User second = userRepository.findByEmailIgnoreCase("bruno@unifor.br").orElseThrow();

        mockMvc.perform(get("/api/posts").header("Authorization", bearer(secondToken)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].likedByCurrentUser").value(false));

        long commentId = extractId(mockMvc.perform(post("/api/posts/{id}/comments", postId)
                        .header("Authorization", bearer(secondToken)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"Use a notação assintótica.\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString());
        mockMvc.perform(post("/api/posts/{id}/comments", postId).header("Authorization", bearer(secondToken))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"content\":\"" + "x".repeat(301) + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.content").value("A resposta deve ter no máximo 300 caracteres"));

        mockMvc.perform(post("/api/posts/{id}/likes", postId).header("Authorization", bearer(secondToken)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.likeCount").value(1));
        mockMvc.perform(post("/api/posts/{id}/likes", postId).header("Authorization", bearer(secondToken)))
                .andExpect(status().isConflict());
        mockMvc.perform(delete("/api/posts/{id}/likes", postId).header("Authorization", bearer(secondToken)))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/api/users/{id}/follow", admin.getId()).header("Authorization", bearer(secondToken)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.followedByCurrentUser").value(true));
        mockMvc.perform(post("/api/users/{id}/follow", admin.getId()).header("Authorization", bearer(secondToken)))
                .andExpect(status().isConflict());
        mockMvc.perform(post("/api/users/{id}/follow", second.getId()).header("Authorization", bearer(secondToken)))
                .andExpect(status().isBadRequest());
        mockMvc.perform(get("/api/users/{id}/followers", admin.getId()).header("Authorization", bearer(secondToken)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content", hasSize(1)));
        mockMvc.perform(delete("/api/users/{id}/follow", admin.getId()).header("Authorization", bearer(secondToken)))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/api/reports").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"postId\":" + postId + ",\"reason\":\"SPAM\"}"))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/api/reports").header("Authorization", bearer(secondToken))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"reason\":\"SPAM\"}"))
                .andExpect(status().isBadRequest());
        long reportId = extractId(mockMvc.perform(post("/api/reports").header("Authorization", bearer(secondToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"postId\":" + postId + ",\"reason\":\"FORA_DO_TEMA\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString());
        mockMvc.perform(post("/api/reports").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"postCommentId\":" + commentId + ",\"reason\":\"OUTRO\"}"))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/reports").header("Authorization", bearer(secondToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"postId\":" + postId + ",\"reason\":\"SPAM\"}"))
                .andExpect(status().isConflict());
        mockMvc.perform(patch("/api/reports/{id}", reportId).header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"RESOLVED\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.reviewedBy.id").value(admin.getId()));

        long faqId = extractId(mockMvc.perform(post("/api/admin/faqs").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"question\":\"Como publicar?\",\"answer\":\"Use o formulário do feed.\",\"displayOrder\":1,\"active\":true}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString());
        mockMvc.perform(get("/api/faqs")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(1)));
        mockMvc.perform(put("/api/admin/faqs/{id}", faqId).header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"question\":\"Como publicar?\",\"answer\":\"Abra o feed.\",\"displayOrder\":2,\"active\":false}"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/faqs")).andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(0)));
        mockMvc.perform(delete("/api/admin/faqs/{id}", faqId).header("Authorization", bearer(adminToken)))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/comments/{id}", commentId).header("Authorization", bearer(secondToken)))
                .andExpect(status().isNoContent());
        mockMvc.perform(delete("/api/posts/{id}", postId).header("Authorization", bearer(adminToken)))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/posts/{id}", postId).header("Authorization", bearer(adminToken)))
                .andExpect(status().isNotFound());
        mockMvc.perform(delete("/api/subjects/{id}", subjectId).header("Authorization", bearer(adminToken)))
                .andExpect(status().isConflict());

        String rawResetToken = "8c3aa61a-5523-47e6-9423-621bf2ace243";
        tokenRepository.saveAndFlush(new PasswordResetToken(second, sha256(rawResetToken), LocalDateTime.now().plusMinutes(15)));
        mockMvc.perform(post("/api/auth/password/reset").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\":\"" + rawResetToken + "\",\"password\":\"NovaSenha123\",\"passwordConfirmation\":\"NovaSenha123\"}"))
                .andExpect(status().isOk());
        login("bruno", "NovaSenha123");
        mockMvc.perform(post("/api/auth/password/reset").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\":\"" + rawResetToken + "\",\"password\":\"OutraSenha123\",\"passwordConfirmation\":\"OutraSenha123\"}"))
                .andExpect(status().isConflict());

        mockMvc.perform(patch("/api/admin/users/{id}/role", second.getId())
                        .header("Authorization", bearer(adminToken)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"role\":\"MODERATOR\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.role").value("MODERATOR"));
        mockMvc.perform(patch("/api/admin/users/{id}/status", second.getId())
                        .header("Authorization", bearer(adminToken)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"SUSPENDED\"}"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/users/me").header("Authorization", bearer(secondToken)))
                .andExpect(status().isForbidden());
        mockMvc.perform(patch("/api/admin/users/{id}/status", second.getId())
                        .header("Authorization", bearer(adminToken)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"ACTIVE\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/posts")).andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/admin/users").header("Authorization", bearer(secondToken)))
                .andExpect(status().isForbidden());
    }

    private String register(String email, String password) throws Exception {
        return mockMvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(registrationJson(email, password)))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.accessToken").isString())
                .andReturn().getResponse().getContentAsString().replaceAll(".*\"accessToken\":\"([^\"]+)\".*", "$1");
    }

    private String login(String identifier, String password) throws Exception {
        return mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"identifier\":\"" + identifier + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString()
                .replaceAll(".*\"accessToken\":\"([^\"]+)\".*", "$1");
    }

    private String registrationJson(String email, String password) {
        return "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
    }

    private String profileJson(String name, String username) {
        return "{\"name\":\"" + name + "\",\"username\":\"" + username + "\"}";
    }

    private String bearer(String token) { return "Bearer " + token; }
    private long extractId(String json) { return Long.parseLong(json.replaceAll("^\\{\"id\":(\\d+),.*", "$1")); }

    private String sha256(String value) throws Exception {
        return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                .digest(value.getBytes(StandardCharsets.UTF_8)));
    }
}

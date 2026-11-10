package com.companion;

import com.companion.entities.PasswordResetToken;
import com.companion.entities.User;
import com.companion.enums.UserRole;
import com.companion.repositories.CourseRepository;
import com.companion.repositories.PasswordResetTokenRepository;
import com.companion.repositories.SubjectRepository;
import com.companion.repositories.UniversityRepository;
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
    @Autowired UniversityRepository universityRepository;
    @Autowired CourseRepository courseRepository;
    @Autowired SubjectRepository subjectRepository;

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

        // Catálogo acadêmico carregado na inicialização.
        long universityId = universityRepository.findByAcronymIgnoreCase("UNIFOR").orElseThrow().getId();
        long courseId = courseRepository.findByUniversityIdOrderByNameAsc(universityId).getFirst().getId();
        long gradeSubjectId = subjectRepository.findByUniversityIdAndCodeIgnoreCase(universityId, "T390")
                .orElseThrow().getId();
        mockMvc.perform(get("/api/universities").header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].acronym").value("UNIFOR"));
        mockMvc.perform(get("/api/universities/{id}/courses", universityId).header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Ciência da Computação"))
                .andExpect(jsonPath("$[0].totalSemesters").value(8));
        mockMvc.perform(get("/api/courses/{id}/subjects", courseId).header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(75)))
                .andExpect(jsonPath("$[0].semester").value(1))
                .andExpect(jsonPath("$[74].semester").value(0));
        mockMvc.perform(get("/api/subjects").header("Authorization", bearer(adminToken)).param("query", "t390"))
                .andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Estrutura de dados"));

        mockMvc.perform(put("/api/users/me/profile").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Ana Clara\",\"username\":\"anaclara\",\"courseId\":" + courseId + ",\"semester\":9}"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(put("/api/users/me/profile").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Ana Clara\",\"username\":\"anaclara\",\"registrationNumber\":\"2510123\","
                                + "\"courseId\":" + courseId + ",\"semester\":4}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseId").value(courseId))
                .andExpect(jsonPath("$.course").value("Ciência da Computação"))
                .andExpect(jsonPath("$.university").value("Universidade de Fortaleza"))
                .andExpect(jsonPath("$.semester").value(4))
                .andExpect(jsonPath("$.registrationNumber").value("2510123"));
        mockMvc.perform(put("/api/users/me/profile").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"" + "x".repeat(65) + "\",\"username\":\"anaclara\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.name").value("O nome deve ter no máximo 64 caracteres"));

        long subjectId = extractId(mockMvc.perform(post("/api/subjects")
                        .header("Authorization", bearer(adminToken)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"universityId\":" + universityId + ",\"code\":\"tst01\",\"name\":\"Algoritmos\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("TST01"))
                .andReturn().getResponse().getContentAsString());

        mockMvc.perform(post("/api/subjects").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"universityId\":" + universityId + ",\"code\":\"TST01\",\"name\":\"Outra\"}"))
                .andExpect(status().isConflict());

        mockMvc.perform(post("/api/users/me/subjects").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subjectId\":" + subjectId + ",\"interestType\":\"DOMINA\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.subject.name").value("Algoritmos"))
                .andExpect(jsonPath("$.proficiency").doesNotExist());
        mockMvc.perform(put("/api/users/me/subjects/{id}", subjectId).header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"interestType\":\"QUER_APRENDER\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.interestType").value("QUER_APRENDER"));

        long postId = extractId(mockMvc.perform(post("/api/posts").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subjectIds\":[" + subjectId + "," + gradeSubjectId
                                + "],\"title\":\"Complexidade\",\"content\":\"Como analisar este algoritmo?\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.subjects", hasSize(2)))
                .andReturn().getResponse().getContentAsString());
        mockMvc.perform(post("/api/posts").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subjectIds\":[" + subjectId + "],\"title\":\"Limite\",\"content\":\"" + "x".repeat(257) + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.content").value("O conteúdo deve ter no máximo 256 caracteres"));
        mockMvc.perform(post("/api/posts").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subjectIds\":[],\"title\":\"Sem matéria\",\"content\":\"Conteúdo\"}"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(post("/api/posts").header("Authorization", bearer(adminToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subjectIds\":[" + subjectId + "],\"title\":\"" + "x".repeat(129) + "\",\"content\":\"Conteúdo\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.title").value("O título deve ter no máximo 128 caracteres"));
        mockMvc.perform(get("/api/posts").header("Authorization", bearer(adminToken))
                        .param("subjectId", String.valueOf(gradeSubjectId)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content", hasSize(1)));
        mockMvc.perform(get("/api/posts").header("Authorization", bearer(adminToken))
                        .param("query", "estrutura de dados"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content", hasSize(1)));
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
                        .contentType(MediaType.APPLICATION_JSON).content("{\"content\":\"" + "x".repeat(257) + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.content").value("A resposta deve ter no máximo 256 caracteres"));

        mockMvc.perform(post("/api/posts/{id}/likes", postId).header("Authorization", bearer(secondToken)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.likeCount").value(1));
        mockMvc.perform(post("/api/posts/{id}/likes", postId).header("Authorization", bearer(secondToken)))
                .andExpect(status().isConflict());
        mockMvc.perform(delete("/api/posts/{id}/likes", postId).header("Authorization", bearer(secondToken)))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/api/posts/{id}/saves", postId).header("Authorization", bearer(secondToken)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.savedByCurrentUser").value(true));
        mockMvc.perform(post("/api/posts/{id}/saves", postId).header("Authorization", bearer(secondToken)))
                .andExpect(status().isConflict());
        mockMvc.perform(get("/api/users/me/saved-posts").header("Authorization", bearer(secondToken)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].savedByCurrentUser").value(true));
        mockMvc.perform(get("/api/posts").header("Authorization", bearer(adminToken)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].savedByCurrentUser").value(false));
        mockMvc.perform(delete("/api/posts/{id}/saves", postId).header("Authorization", bearer(secondToken)))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/users/me/saved-posts").header("Authorization", bearer(secondToken)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.content", hasSize(0)));

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

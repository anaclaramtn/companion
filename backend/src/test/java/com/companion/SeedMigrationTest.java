package com.companion;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Com o perfil "seed", o FlywaySeedRunner aplica db/seed/V1 na subida (depois do
// Hibernate e do catálogo acadêmico), exatamente como no uso real.
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("seed")
class SeedMigrationTest {

    @Autowired JdbcTemplate jdbc;
    @Autowired MockMvc mockMvc;

    private int count(String table) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class);
    }

    @Test
    void createsExampleUsersPostsAndInteractions() {
        assertEquals(6, count("users"));
        assertEquals(12, count("posts"));
        assertEquals(14, count("post_subjects"));
        assertEquals(12, count("post_comments"));
        assertEquals(23, count("post_likes"));
        assertEquals(12, count("follows"));
        // O Flyway registrou o que aplicou (baseline + V1).
        assertTrue(count("\"flyway_schema_history\"") >= 1);
    }

    @Test
    void exampleUsersCanLogInWithTheDocumentedPassword() throws Exception {
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"identifier\":\"ana.exemplo@edu.unifor.br\",\"password\":\"Senha123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isString());
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"identifier\":\"brunolima\",\"password\":\"Senha123\"}"))
                .andExpect(status().isOk());
    }
}

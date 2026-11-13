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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
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
        // V1 (6 usuários, 12 dúvidas) + V2 (8 usuários, 20 dúvidas e as fotos).
        assertEquals(14, count("users"));
        assertEquals(32, count("posts"));
        assertEquals(39, count("post_subjects"));
        assertEquals(49, count("post_comments"));
        assertEquals(96, count("post_likes"));
        assertEquals(51, count("follows"));
        assertEquals(14, count("user_avatars"));
        // V3: 14 usuários com 55 matérias dominadas e 14 que querem aprender.
        assertEquals(69, count("user_subjects"));
        // O Flyway registrou o que aplicou (baseline + V1).
        assertTrue(count("\"flyway_schema_history\"") >= 3);
    }

    @Test
    void exampleUsersHaveProfilePhotosServedByTheApi() throws Exception {
        long anaId = jdbc.queryForObject(
                "SELECT id FROM users WHERE email = 'ana.exemplo@edu.unifor.br'", Long.class);
        String avatarUrl = jdbc.queryForObject("SELECT avatar_url FROM users WHERE id = ?", String.class, anaId);
        assertTrue(avatarUrl.endsWith("/api/users/" + anaId + "/avatar?v=2"));

        // O endereço é público e devolve o JPEG gravado pela migração.
        byte[] photo = mockMvc.perform(get("/api/users/" + anaId + "/avatar"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("image/jpeg"))
                .andReturn().getResponse().getContentAsByteArray();
        assertTrue(photo.length > 1000);
        // Começa com a assinatura de um JPEG (FF D8 FF).
        assertEquals((byte) 0xFF, photo[0]);
        assertEquals((byte) 0xD8, photo[1]);
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

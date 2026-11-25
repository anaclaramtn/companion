package com.companion;

import com.companion.entities.User;
import com.companion.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminExportIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;

    @Test
    void adminDownloadsUsersCsvWithoutPasswordData() throws Exception {
        userRepository.saveAndFlush(new User("exporta@edu.unifor.br", "hash-secreto-123"));

        mockMvc.perform(get("/api/admin/export/users.csv")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", containsString("text/csv")))
                .andExpect(header().string("Content-Disposition", containsString("attachment")))
                .andExpect(header().string("Content-Disposition", containsString("usuarios-")))
                .andExpect(content().string(containsString("id;email;nome;username")))
                .andExpect(content().string(containsString("exporta@edu.unifor.br")))
                .andExpect(content().string(not(containsString("hash-secreto-123"))));
    }

    @Test
    void adminDownloadsReportsCsvHeader() throws Exception {
        mockMvc.perform(get("/api/admin/export/reports.csv").param("status", "PENDING")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", containsString("denuncias-")))
                .andExpect(content().string(containsString("id;situacao;motivo;tipo_alvo")));
    }

    @Test
    void nonAdminsAndAnonymousAreRejected() throws Exception {
        mockMvc.perform(get("/api/admin/export/users.csv")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/admin/export/reports.csv")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/admin/export/users.csv"))
                .andExpect(status().isUnauthorized());
    }
}

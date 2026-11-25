package com.companion;

import com.companion.entities.User;
import com.companion.enums.UserRole;
import com.companion.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class TicketIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;

    @Test
    void studentSendsTicketAndAdminAnswersAndClosesIt() throws Exception {
        User student = profileUser("ticket-aluno@edu.unifor.br", "ticketaluno", UserRole.USER);
        User admin = profileUser("ticket-admin@edu.unifor.br", "ticketadmin", UserRole.ADMIN);

        String body = "{\"subject\":\"  Não consigo postar  \",\"message\":\"Aparece um erro ao publicar.\"}";
        String created = mockMvc.perform(post("/api/tickets").with(as(student)).contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("OPEN"))
                .andExpect(jsonPath("$.subject").value("Não consigo postar"))
                .andExpect(jsonPath("$.author.username").value("ticketaluno"))
                .andReturn().getResponse().getContentAsString();
        long ticketId = ((Number) com.jayway.jsonpath.JsonPath.read(created, "$.id")).longValue();

        mockMvc.perform(get("/api/tickets/mine").with(as(student)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[*].id", hasItem((int) ticketId)));
        // Outra pessoa não vê o ticket.
        mockMvc.perform(get("/api/tickets/mine").with(as(admin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[*].id", org.hamcrest.Matchers.not(hasItem((int) ticketId))));

        mockMvc.perform(get("/api/admin/tickets").param("status", "OPEN").with(as(admin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[*].id", hasItem((int) ticketId)));

        mockMvc.perform(post("/api/admin/tickets/{id}/reply", ticketId).with(as(admin))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"response\":\"Já corrigimos, tente de novo.\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ANSWERED"))
                .andExpect(jsonPath("$.response").value("Já corrigimos, tente de novo."))
                .andExpect(jsonPath("$.respondedBy.username").value("ticketadmin"));
        // Não responde duas vezes.
        mockMvc.perform(post("/api/admin/tickets/{id}/reply", ticketId).with(as(admin))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"response\":\"De novo\"}"))
                .andExpect(status().isConflict());

        mockMvc.perform(post("/api/admin/tickets/{id}/close", ticketId).with(as(admin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CLOSED"));
        mockMvc.perform(post("/api/admin/tickets/{id}/close", ticketId).with(as(admin)))
                .andExpect(status().isConflict());
    }

    @Test
    void validatesInputAndLimitsOpenTickets() throws Exception {
        User student = profileUser("ticket-limite@edu.unifor.br", "ticketlimite", UserRole.USER);

        mockMvc.perform(post("/api/tickets").with(as(student)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subject\":\"  \",\"message\":\"\"}"))
                .andExpect(status().isBadRequest());

        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/tickets").with(as(student)).contentType(MediaType.APPLICATION_JSON)
                            .content("{\"subject\":\"Assunto " + i + "\",\"message\":\"Mensagem\"}"))
                    .andExpect(status().isCreated());
        }
        mockMvc.perform(post("/api/tickets").with(as(student)).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"subject\":\"Sexto\",\"message\":\"Mensagem\"}"))
                .andExpect(status().isConflict());
    }

    @Test
    void onlyAdminsManageTickets() throws Exception {
        User student = profileUser("ticket-comum@edu.unifor.br", "ticketcomum", UserRole.USER);

        mockMvc.perform(get("/api/admin/tickets").with(as(student))).andExpect(status().isForbidden());
        mockMvc.perform(post("/api/admin/tickets/1/close").with(as(student))).andExpect(status().isForbidden());
        mockMvc.perform(get("/api/tickets/mine")).andExpect(status().isUnauthorized());
    }

    private User profileUser(String email, String username, UserRole role) {
        User user = new User(email);
        user.updateProfile("Pessoa " + username, username, null, null, null, null);
        user.changeRole(role);
        return userRepository.saveAndFlush(user);
    }

    private RequestPostProcessor as(User user) {
        return jwt().jwt(token -> token.subject(String.valueOf(user.getId())))
                .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }
}

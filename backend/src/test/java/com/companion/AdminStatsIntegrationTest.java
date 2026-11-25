package com.companion;

import com.companion.entities.Post;
import com.companion.entities.PostComment;
import com.companion.entities.Report;
import com.companion.entities.User;
import com.companion.enums.ReportReason;
import com.companion.enums.ReportStatus;
import com.companion.repositories.PostCommentRepository;
import com.companion.repositories.PostRepository;
import com.companion.repositories.ReportRepository;
import com.companion.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminStatsIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;
    @Autowired PostRepository postRepository;
    @Autowired PostCommentRepository commentRepository;
    @Autowired ReportRepository reportRepository;

    @Test
    void countsStudentsAnswersAndReports() throws Exception {
        // O banco de testes é compartilhado: compara com o estado antes e depois.
        long usersBefore = totalUsers();
        long answerersBefore = answerers();
        long reportsBefore = reports("total");
        long resolvedBefore = reports("resolved");
        long pendingBefore = reports("pending");

        User author = userRepository.saveAndFlush(new User("stats-autor@edu.unifor.br"));
        User helper = userRepository.saveAndFlush(new User("stats-ajuda@edu.unifor.br"));
        Post post = postRepository.saveAndFlush(new Post(author, Set.of(), "Duvida", "Conteudo"));
        // Responder a própria dúvida não conta como "solucionou".
        commentRepository.saveAndFlush(new PostComment(post, author, "eu mesmo"));
        commentRepository.saveAndFlush(new PostComment(post, helper, "a resposta"));
        commentRepository.saveAndFlush(new PostComment(post, helper, "outra resposta"));

        Report resolved = new Report(author, post, null, ReportReason.SPAM, null);
        resolved.review(helper, ReportStatus.RESOLVED);
        reportRepository.saveAndFlush(resolved);
        reportRepository.saveAndFlush(new Report(helper, post, null, ReportReason.OUTRO, "detalhe"));

        assertEquals(usersBefore + 2, totalUsers());
        assertEquals(answerersBefore + 1, answerers());
        assertEquals(reportsBefore + 2, reports("total"));
        assertEquals(resolvedBefore + 1, reports("resolved"));
        assertEquals(pendingBefore + 1, reports("pending"));
    }

    @Test
    void onlyAdminsCanReadStats() throws Exception {
        mockMvc.perform(get("/api/admin/stats")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.users.total").isNumber())
                .andExpect(jsonPath("$.content.posts").isNumber())
                .andExpect(jsonPath("$.reports.pending").isNumber())
                .andExpect(jsonPath("$.topSubjects").isArray());
        mockMvc.perform(get("/api/admin/stats")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/admin/stats")).andExpect(status().isUnauthorized());
    }

    private long totalUsers() throws Exception { return number("$.users.total"); }

    private long answerers() throws Exception { return number("$.users.answeredAtLeastOne"); }

    private long reports(String field) throws Exception { return number("$.reports." + field); }

    private long number(String path) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/admin/stats")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
                .andExpect(status().isOk()).andReturn();
        return ((Number) com.jayway.jsonpath.JsonPath.read(result.getResponse().getContentAsString(), path)).longValue();
    }
}

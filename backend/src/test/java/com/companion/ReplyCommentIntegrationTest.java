package com.companion;

import com.companion.entities.Post;
import com.companion.entities.PostComment;
import com.companion.entities.User;
import com.companion.enums.UserRole;
import com.companion.repositories.PostCommentRepository;
import com.companion.repositories.PostRepository;
import com.companion.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.Set;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ReplyCommentIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;
    @Autowired PostRepository postRepository;
    @Autowired PostCommentRepository commentRepository;

    @Test
    void commentsInsideAReplyAreCreatedListedCountedAndDeleted() throws Exception {
        User asker = profileUser("rc-autor@edu.unifor.br", "rcautor", UserRole.USER);
        User answerer = profileUser("rc-resposta@edu.unifor.br", "rcresposta", UserRole.USER);
        User other = profileUser("rc-outro@edu.unifor.br", "rcoutro", UserRole.USER);
        User moderator = profileUser("rc-mod@edu.unifor.br", "rcmod", UserRole.ADMIN);
        Post question = postRepository.saveAndFlush(new Post(asker, Set.of(), "Duvida", "Conteudo"));
        PostComment reply = commentRepository.saveAndFlush(new PostComment(question, answerer, "Uma resposta"));

        // Sem comentários: contagem zero.
        mockMvc.perform(get("/api/posts/{id}/comments", question.getId()).with(as(asker)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].commentCount").value(0));

        String created = mockMvc.perform(post("/api/replies/{id}/comments", reply.getId()).with(as(asker))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"content\":\"  Pode explicar melhor?  \"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value("Pode explicar melhor?"))
                .andExpect(jsonPath("$.replyId").value(reply.getId()))
                .andExpect(jsonPath("$.author.username").value("rcautor"))
                .andExpect(jsonPath("$.ownedByCurrentUser").value(true))
                .andReturn().getResponse().getContentAsString();
        long commentId = ((Number) com.jayway.jsonpath.JsonPath.read(created, "$.id")).longValue();

        mockMvc.perform(get("/api/replies/{id}/comments", reply.getId()).with(as(other)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(commentId))
                .andExpect(jsonPath("$[0].ownedByCurrentUser").value(false));
        // A contagem da resposta sobe, mas a da dúvida (só respostas) não muda.
        mockMvc.perform(get("/api/posts/{id}/comments", question.getId()).with(as(other)))
                .andExpect(jsonPath("$[0].commentCount").value(1));
        mockMvc.perform(get("/api/posts/{id}", question.getId()).with(as(other)))
                .andExpect(jsonPath("$.commentCount").value(1));

        // Quem não é autor nem moderação não exclui.
        mockMvc.perform(delete("/api/reply-comments/{id}", commentId).with(as(other)))
                .andExpect(status().isForbidden());
        mockMvc.perform(delete("/api/reply-comments/{id}", commentId).with(as(moderator)))
                .andExpect(status().isNoContent());
        mockMvc.perform(delete("/api/reply-comments/{id}", commentId).with(as(asker)))
                .andExpect(status().isNotFound());
        mockMvc.perform(get("/api/replies/{id}/comments", reply.getId()).with(as(other)))
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void limitsEachReplyToFiveComments() throws Exception {
        User asker = profileUser("rc-limite@edu.unifor.br", "rclimite", UserRole.USER);
        Post question = postRepository.saveAndFlush(new Post(asker, Set.of(), "Duvida", "Conteudo"));
        PostComment reply = commentRepository.saveAndFlush(new PostComment(question, asker, "Resposta"));
        PostComment otherReply = commentRepository.saveAndFlush(new PostComment(question, asker, "Outra resposta"));

        long firstId = 0;
        for (int i = 0; i < 5; i++) {
            String body = mockMvc.perform(post("/api/replies/{id}/comments", reply.getId()).with(as(asker))
                            .contentType(MediaType.APPLICATION_JSON).content("{\"content\":\"Comentario " + i + "\"}"))
                    .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
            if (i == 0) firstId = ((Number) com.jayway.jsonpath.JsonPath.read(body, "$.id")).longValue();
        }
        mockMvc.perform(post("/api/replies/{id}/comments", reply.getId()).with(as(asker))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"content\":\"Sexto\"}"))
                .andExpect(status().isConflict());
        // O limite vale por resposta: outra resposta continua aceitando.
        mockMvc.perform(post("/api/replies/{id}/comments", otherReply.getId()).with(as(asker))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"content\":\"Ok\"}"))
                .andExpect(status().isCreated());
        // Excluir um comentário libera uma vaga.
        mockMvc.perform(delete("/api/reply-comments/{id}", firstId).with(as(asker))).andExpect(status().isNoContent());
        mockMvc.perform(post("/api/replies/{id}/comments", reply.getId()).with(as(asker))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"content\":\"Agora cabe\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    void validatesContentAndRequiresAnExistingReply() throws Exception {
        User asker = profileUser("rc-valida@edu.unifor.br", "rcvalida", UserRole.USER);
        Post question = postRepository.saveAndFlush(new Post(asker, Set.of(), "Duvida", "Conteudo"));
        PostComment reply = commentRepository.saveAndFlush(new PostComment(question, asker, "Resposta"));

        mockMvc.perform(post("/api/replies/{id}/comments", reply.getId()).with(as(asker))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"content\":\"   \"}"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(post("/api/replies/{id}/comments", reply.getId()).with(as(asker))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"" + "x".repeat(257) + "\"}"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(post("/api/replies/{id}/comments", 999999).with(as(asker))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"content\":\"oi\"}"))
                .andExpect(status().isNotFound());

        // Resposta apagada: não aceita mais comentários.
        reply.delete();
        commentRepository.saveAndFlush(reply);
        mockMvc.perform(post("/api/replies/{id}/comments", reply.getId()).with(as(asker))
                        .contentType(MediaType.APPLICATION_JSON).content("{\"content\":\"oi\"}"))
                .andExpect(status().isNotFound());
        mockMvc.perform(get("/api/replies/{id}/comments", reply.getId())).andExpect(status().isUnauthorized());
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

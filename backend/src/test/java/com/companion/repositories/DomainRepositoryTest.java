package com.companion.repositories;

import com.companion.entities.Post;
import com.companion.entities.PostLike;
import com.companion.entities.Subject;
import com.companion.entities.User;
import com.companion.entities.UserSubject;
import com.companion.enums.Proficiency;
import com.companion.enums.SubjectInterestType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
class DomainRepositoryTest {
    @Autowired UserRepository userRepository;
    @Autowired SubjectRepository subjectRepository;
    @Autowired UserSubjectRepository userSubjectRepository;
    @Autowired PostRepository postRepository;
    @Autowired PostLikeRepository postLikeRepository;

    @Test
    void databaseRejectsDuplicateAcademicRelation() {
        User user = userRepository.saveAndFlush(new User("repo@unifor.br", "hash"));
        Subject subject = subjectRepository.saveAndFlush(new Subject("Estruturas de Dados"));
        userSubjectRepository.saveAndFlush(new UserSubject(user, subject,
                SubjectInterestType.DOMINA, Proficiency.AVANCADO));

        assertThrows(DataIntegrityViolationException.class, () -> userSubjectRepository.saveAndFlush(
                new UserSubject(user, subject, SubjectInterestType.QUER_APRENDER, Proficiency.INICIANTE)));
    }

    @Test
    void databaseRejectsDuplicatePostLike() {
        User user = userRepository.saveAndFlush(new User("like@unifor.br", "hash"));
        Subject subject = subjectRepository.saveAndFlush(new Subject("Grafos"));
        Post post = postRepository.saveAndFlush(new Post(user, subject, "Árvores", "Como balancear uma árvore?"));
        postLikeRepository.saveAndFlush(new PostLike(user, post));
        assertThrows(DataIntegrityViolationException.class,
                () -> postLikeRepository.saveAndFlush(new PostLike(user, post)));
    }
}

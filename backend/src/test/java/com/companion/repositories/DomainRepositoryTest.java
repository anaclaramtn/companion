package com.companion.repositories;

import com.companion.entities.Course;
import com.companion.entities.CourseSubject;
import com.companion.entities.Post;
import com.companion.entities.PostLike;
import com.companion.entities.PostSave;
import com.companion.entities.Subject;
import com.companion.entities.University;
import com.companion.entities.User;
import com.companion.entities.UserSubject;
import com.companion.enums.SubjectInterestType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
class DomainRepositoryTest {
    @Autowired UserRepository userRepository;
    @Autowired UniversityRepository universityRepository;
    @Autowired CourseRepository courseRepository;
    @Autowired SubjectRepository subjectRepository;
    @Autowired CourseSubjectRepository courseSubjectRepository;
    @Autowired UserSubjectRepository userSubjectRepository;
    @Autowired PostRepository postRepository;
    @Autowired PostLikeRepository postLikeRepository;
    @Autowired PostSaveRepository postSaveRepository;

    @Test
    void databaseRejectsDuplicateAcademicRelation() {
        User user = userRepository.saveAndFlush(new User("repo@unifor.br", "hash"));
        Subject subject = subject("T390", "Estrutura de dados");
        userSubjectRepository.saveAndFlush(new UserSubject(user, subject, SubjectInterestType.DOMINA));

        assertThrows(DataIntegrityViolationException.class, () -> userSubjectRepository.saveAndFlush(
                new UserSubject(user, subject, SubjectInterestType.QUER_APRENDER)));
    }

    @Test
    void databaseRejectsDuplicateSubjectCodeInSameUniversity() {
        University university = university();
        subjectRepository.saveAndFlush(new Subject(university, "T290", "Resolução prob com grafos"));

        assertThrows(DataIntegrityViolationException.class, () -> subjectRepository.saveAndFlush(
                new Subject(university, "T290", "Outro nome")));
    }

    @Test
    void courseGradeKeepsElectivesAsSemesterZeroAndRejectsNegativeSemester() {
        University university = university();
        Course course = courseRepository.saveAndFlush(new Course(university, "Ciência da Computação", 8));
        Subject regular = subjectRepository.saveAndFlush(new Subject(university, "T390", "Estrutura de dados"));
        Subject elective = subjectRepository.saveAndFlush(new Subject(university, "H799", "Libras"));
        courseSubjectRepository.saveAndFlush(new CourseSubject(course, elective, 0));
        courseSubjectRepository.saveAndFlush(new CourseSubject(course, regular, 3));

        assertEquals(java.util.List.of("T390", "H799"), courseSubjectRepository.findGrade(course.getId()).stream()
                .map(item -> item.getSubject().getCode()).toList());

        Subject invalid = subjectRepository.saveAndFlush(new Subject(university, "X001", "Inválida"));
        assertThrows(DataIntegrityViolationException.class, () -> courseSubjectRepository.saveAndFlush(
                new CourseSubject(course, invalid, -1)));
    }

    @Test
    void postKeepsOneRowPerSubject() {
        User user = userRepository.saveAndFlush(new User("multi@unifor.br", "hash"));
        University university = university();
        Subject first = subjectRepository.saveAndFlush(new Subject(university, "T290", "Grafos"));
        Subject second = subjectRepository.saveAndFlush(new Subject(university, "T390", "Estrutura de dados"));
        Post post = postRepository.saveAndFlush(new Post(user, Set.of(first, second), "Árvores", "Como balancear?"));

        assertEquals(2, post.getSubjects().size());
        assertEquals(true, postRepository.existsBySubjectsId(first.getId()));
    }

    @Test
    void databaseRejectsDuplicatePostLike() {
        User user = userRepository.saveAndFlush(new User("like@unifor.br", "hash"));
        Post post = post(user);
        postLikeRepository.saveAndFlush(new PostLike(user, post));
        assertThrows(DataIntegrityViolationException.class,
                () -> postLikeRepository.saveAndFlush(new PostLike(user, post)));
    }

    @Test
    void databaseRejectsDuplicatePostSave() {
        User user = userRepository.saveAndFlush(new User("save@unifor.br", "hash"));
        Post post = post(user);
        postSaveRepository.saveAndFlush(new PostSave(user, post));
        assertThrows(DataIntegrityViolationException.class,
                () -> postSaveRepository.saveAndFlush(new PostSave(user, post)));
    }

    private Post post(User author) {
        Subject subject = subject("T290", "Grafos");
        return postRepository.saveAndFlush(new Post(author, Set.of(subject), "Árvores", "Como balancear uma árvore?"));
    }

    private University university() {
        return universityRepository.saveAndFlush(new University("Universidade de Teste", "UTESTE", null));
    }

    private Subject subject(String code, String name) {
        return subjectRepository.saveAndFlush(new Subject(university(), code, name));
    }
}

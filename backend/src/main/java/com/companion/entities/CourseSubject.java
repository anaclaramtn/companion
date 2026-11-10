package com.companion.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.Check;

import java.io.Serializable;
import java.util.Objects;

// Grade do curso: liga a disciplina ao curso e guarda o semestre em que ela é
// cursada normalmente. Semestre 0 = optativa. A mesma disciplina pode estar em
// vários cursos, com uma linha para cada curso.
@Entity
@Table(name = "course_subjects",
        indexes = @Index(name = "idx_course_subjects_subject", columnList = "subject_id"))
@Check(constraints = "semester >= 0")
public class CourseSubject {

    @EmbeddedId
    private Id id;

    @MapsId("courseId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false, foreignKey = @ForeignKey(name = "fk_course_subjects_course"))
    private Course course;

    @MapsId("subjectId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "subject_id", nullable = false, foreignKey = @ForeignKey(name = "fk_course_subjects_subject"))
    private Subject subject;

    @Column(nullable = false)
    private Integer semester;

    protected CourseSubject() { }

    public CourseSubject(Course course, Subject subject, Integer semester) {
        this.id = new Id(course.getId(), subject.getId());
        this.course = course;
        this.subject = subject;
        this.semester = semester;
    }

    public boolean isElective() { return semester == 0; }
    public Id getId() { return id; }
    public Course getCourse() { return course; }
    public Subject getSubject() { return subject; }
    public Integer getSemester() { return semester; }

    @Embeddable
    public static class Id implements Serializable {
        @Column(name = "course_id")
        private Long courseId;

        @Column(name = "subject_id")
        private Long subjectId;

        protected Id() { }

        public Id(Long courseId, Long subjectId) {
            this.courseId = courseId;
            this.subjectId = subjectId;
        }

        public Long getCourseId() { return courseId; }
        public Long getSubjectId() { return subjectId; }

        @Override
        public boolean equals(Object other) {
            if (this == other) return true;
            if (!(other instanceof Id id)) return false;
            return Objects.equals(courseId, id.courseId) && Objects.equals(subjectId, id.subjectId);
        }

        @Override
        public int hashCode() { return Objects.hash(courseId, subjectId); }
    }
}

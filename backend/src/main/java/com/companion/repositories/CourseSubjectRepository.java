package com.companion.repositories;

import com.companion.entities.CourseSubject;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseSubjectRepository extends JpaRepository<CourseSubject, CourseSubject.Id> {
    // Grade em ordem de semestre, com as optativas (semestre 0) no fim.
    @EntityGraph(attributePaths = "subject")
    @Query("""
            select cs from CourseSubject cs
            where cs.course.id = :courseId
            order by case when cs.semester = 0 then 1 else 0 end, cs.semester, cs.subject.name
            """)
    List<CourseSubject> findGrade(@Param("courseId") Long courseId);

    boolean existsBySubjectId(Long subjectId);
}

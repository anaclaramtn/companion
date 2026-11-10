package com.companion.services;

import com.companion.dtos.course.CourseResponseDTO;
import com.companion.dtos.course.CourseSubjectResponseDTO;
import com.companion.dtos.course.UniversityResponseDTO;
import com.companion.entities.Course;
import com.companion.entities.CourseSubject;
import com.companion.entities.University;
import com.companion.exceptions.ResourceNotFoundException;
import com.companion.repositories.CourseRepository;
import com.companion.repositories.CourseSubjectRepository;
import com.companion.repositories.UniversityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Consultas de universidades, cursos e grade, usadas nas listas de escolha
// do onboarding e do Editar perfil.
@Service
public class CourseService {
    private final UniversityRepository universityRepository;
    private final CourseRepository courseRepository;
    private final CourseSubjectRepository courseSubjectRepository;

    public CourseService(UniversityRepository universityRepository, CourseRepository courseRepository,
                         CourseSubjectRepository courseSubjectRepository) {
        this.universityRepository = universityRepository;
        this.courseRepository = courseRepository;
        this.courseSubjectRepository = courseSubjectRepository;
    }

    @Transactional(readOnly = true)
    public List<UniversityResponseDTO> listUniversities() {
        return universityRepository.findAllByOrderByNameAsc().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CourseResponseDTO> listCourses(Long universityId) {
        if (!universityRepository.existsById(universityId)) {
            throw new ResourceNotFoundException("Universidade não encontrada");
        }
        return courseRepository.findByUniversityIdOrderByNameAsc(universityId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CourseResponseDTO getCourse(Long id) {
        return toResponse(findCourse(id));
    }

    @Transactional(readOnly = true)
    public List<CourseSubjectResponseDTO> listGrade(Long courseId) {
        findCourse(courseId);
        return courseSubjectRepository.findGrade(courseId).stream().map(this::toResponse).toList();
    }

    private Course findCourse(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso não encontrado"));
    }

    private UniversityResponseDTO toResponse(University university) {
        return new UniversityResponseDTO(university.getId(), university.getName(), university.getAcronym());
    }

    private CourseResponseDTO toResponse(Course course) {
        return new CourseResponseDTO(course.getId(), course.getUniversity().getId(), course.getName(),
                course.getTotalSemesters());
    }

    private CourseSubjectResponseDTO toResponse(CourseSubject item) {
        return new CourseSubjectResponseDTO(item.getSubject().getId(), item.getSubject().getCode(),
                item.getSubject().getName(), item.getSemester());
    }
}

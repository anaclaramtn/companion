package com.companion.controllers;

import com.companion.dtos.course.CourseResponseDTO;
import com.companion.dtos.course.CourseSubjectResponseDTO;
import com.companion.dtos.course.UniversityResponseDTO;
import com.companion.services.CourseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseController {
    private final CourseService service;
    public CourseController(CourseService service) { this.service = service; }

    @GetMapping("/universities")
    public List<UniversityResponseDTO> universities() { return service.listUniversities(); }

    @GetMapping("/universities/{universityId}/courses")
    public List<CourseResponseDTO> courses(@PathVariable Long universityId) {
        return service.listCourses(universityId);
    }

    @GetMapping("/courses/{id}")
    public CourseResponseDTO course(@PathVariable Long id) { return service.getCourse(id); }

    // Grade do curso: disciplinas com o semestre de cada uma (0 = optativa).
    @GetMapping("/courses/{id}/subjects")
    public List<CourseSubjectResponseDTO> grade(@PathVariable Long id) { return service.listGrade(id); }
}

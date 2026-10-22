package com.companion.controllers;

import com.companion.dtos.subject.SubjectRequestDTO;
import com.companion.dtos.subject.SubjectResponseDTO;
import com.companion.services.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
    private final SubjectService subjectService;
    public SubjectController(SubjectService subjectService) { this.subjectService = subjectService; }

    @GetMapping public List<SubjectResponseDTO> list(@RequestParam(required = false) String query) {
        return subjectService.list(query);
    }
    @GetMapping("/{id}") public SubjectResponseDTO get(@PathVariable Long id) { return subjectService.get(id); }

    @PostMapping @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponseDTO> create(@Valid @RequestBody SubjectRequestDTO request) {
        SubjectResponseDTO response = subjectService.create(request);
        return ResponseEntity.created(URI.create("/api/subjects/" + response.id())).body(response);
    }

    @PutMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    public SubjectResponseDTO update(@PathVariable Long id, @Valid @RequestBody SubjectRequestDTO request) {
        return subjectService.update(id, request);
    }

    @DeleteMapping("/{id}") @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subjectService.delete(id); return ResponseEntity.noContent().build();
    }
}

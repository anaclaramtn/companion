package com.companion.controllers;

import com.companion.dtos.subject.*;
import com.companion.services.UserSubjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserSubjectController {
    private final UserSubjectService service;
    public UserSubjectController(UserSubjectService service) { this.service = service; }

    @PostMapping("/users/me/subjects")
    public ResponseEntity<UserSubjectResponseDTO> add(@Valid @RequestBody UserSubjectRequestDTO request) {
        UserSubjectResponseDTO response = service.add(request);
        return ResponseEntity.created(URI.create("/api/users/me/subjects/" + response.subject().id())).body(response);
    }
    @GetMapping("/users/me/subjects") public List<UserSubjectResponseDTO> mine() { return service.listMine(); }
    @GetMapping("/users/me/subjects/{subjectId}") public UserSubjectResponseDTO get(@PathVariable Long subjectId) {
        return service.getMine(subjectId);
    }
    @PutMapping("/users/me/subjects/{subjectId}")
    public UserSubjectResponseDTO update(@PathVariable Long subjectId,
                                         @Valid @RequestBody UserSubjectUpdateRequestDTO request) {
        return service.updateMine(subjectId, request);
    }
    @DeleteMapping("/users/me/subjects/{subjectId}")
    public ResponseEntity<Void> remove(@PathVariable Long subjectId) {
        service.removeMine(subjectId); return ResponseEntity.noContent().build();
    }
    @GetMapping("/users/{userId}/subjects")
    public List<UserSubjectResponseDTO> forUser(@PathVariable Long userId) { return service.listForUser(userId); }
}

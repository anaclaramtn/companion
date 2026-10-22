package com.companion.controllers;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.post.PostCreateRequestDTO;
import com.companion.dtos.post.PostResponseDTO;
import com.companion.services.PostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@Validated
@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService service;
    public PostController(PostService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<PostResponseDTO> create(@Valid @RequestBody PostCreateRequestDTO request) {
        PostResponseDTO response = service.create(request);
        return ResponseEntity.created(URI.create("/api/posts/" + response.id())).body(response);
    }
    @GetMapping("/{id}") public PostResponseDTO get(@PathVariable Long id) { return service.get(id); }
    @GetMapping
    public PageResponse<PostResponseDTO> list(@RequestParam(required = false) String query,
                                               @RequestParam(required = false) Long subjectId,
                                               @RequestParam(required = false) Long authorId,
                                               @RequestParam(defaultValue = "0") @Min(0) int page,
                                               @RequestParam(defaultValue = "10") @Min(1) @Max(10) int size) {
        return service.search(query, subjectId, authorId, page, size);
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.noContent().build();
    }
}

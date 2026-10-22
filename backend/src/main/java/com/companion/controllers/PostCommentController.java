package com.companion.controllers;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.post.PostCommentCreateRequestDTO;
import com.companion.dtos.post.PostCommentResponseDTO;
import com.companion.services.PostCommentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api")
public class PostCommentController {
    private final PostCommentService service;
    public PostCommentController(PostCommentService service) { this.service = service; }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<PostCommentResponseDTO> create(@PathVariable Long postId,
                                                          @Valid @RequestBody PostCommentCreateRequestDTO request) {
        PostCommentResponseDTO response = service.create(postId, request);
        return ResponseEntity.created(URI.create("/api/comments/" + response.id())).body(response);
    }
    @GetMapping("/posts/{postId}/comments")
    public List<PostCommentResponseDTO> list(@PathVariable Long postId) { return service.listForPost(postId); }
    @GetMapping("/users/{userId}/comments")
    public PageResponse<PostCommentResponseDTO> forUser(@PathVariable Long userId,
                                                         @RequestParam(defaultValue = "0") @Min(0) int page,
                                                         @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size) {
        return service.listForUser(userId, page, size);
    }
    @DeleteMapping("/comments/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.noContent().build();
    }
}

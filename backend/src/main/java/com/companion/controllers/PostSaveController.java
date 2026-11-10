package com.companion.controllers;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.post.PostResponseDTO;
import com.companion.dtos.post.PostSaveStatusDTO;
import com.companion.services.PostSaveService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api")
public class PostSaveController {
    private final PostSaveService service;
    public PostSaveController(PostSaveService service) { this.service = service; }

    @PostMapping("/posts/{postId}/saves") public PostSaveStatusDTO save(@PathVariable Long postId) {
        return service.save(postId);
    }
    @DeleteMapping("/posts/{postId}/saves") public ResponseEntity<Void> unsave(@PathVariable Long postId) {
        service.unsave(postId); return ResponseEntity.noContent().build();
    }
    @GetMapping("/users/me/saved-posts")
    public PageResponse<PostResponseDTO> saved(@RequestParam(defaultValue = "0") @Min(0) int page,
                                               @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size) {
        return service.savedPosts(page, size);
    }
}

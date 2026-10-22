package com.companion.controllers;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.post.PostLikeStatusDTO;
import com.companion.dtos.post.PostResponseDTO;
import com.companion.services.PostLikeService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api")
public class PostLikeController {
    private final PostLikeService service;
    public PostLikeController(PostLikeService service) { this.service = service; }
    @PostMapping("/posts/{postId}/likes") public PostLikeStatusDTO like(@PathVariable Long postId) {
        return service.like(postId);
    }
    @DeleteMapping("/posts/{postId}/likes") public ResponseEntity<Void> unlike(@PathVariable Long postId) {
        service.unlike(postId); return ResponseEntity.noContent().build();
    }
    @GetMapping("/posts/{postId}/likes") public PostLikeStatusDTO status(@PathVariable Long postId) {
        return service.status(postId);
    }
    @GetMapping("/users/me/liked-posts")
    public PageResponse<PostResponseDTO> liked(@RequestParam(defaultValue = "0") @Min(0) int page,
                                               @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size) {
        return service.likedPosts(page, size);
    }
}

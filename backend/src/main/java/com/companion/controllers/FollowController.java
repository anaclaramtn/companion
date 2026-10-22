package com.companion.controllers;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.follow.FollowStatusDTO;
import com.companion.dtos.user.UserSummaryResponseDTO;
import com.companion.services.FollowService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/users/{userId}")
public class FollowController {
    private final FollowService service;
    public FollowController(FollowService service) { this.service = service; }
    @PostMapping("/follow") public FollowStatusDTO follow(@PathVariable Long userId) { return service.follow(userId); }
    @DeleteMapping("/follow") public ResponseEntity<Void> unfollow(@PathVariable Long userId) {
        service.unfollow(userId); return ResponseEntity.noContent().build();
    }
    @GetMapping("/follow-status") public FollowStatusDTO status(@PathVariable Long userId) { return service.status(userId); }
    @GetMapping("/followers") public PageResponse<UserSummaryResponseDTO> followers(
            @PathVariable Long userId, @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(50) int size) {
        return service.followers(userId, page, size);
    }
    @GetMapping("/following") public PageResponse<UserSummaryResponseDTO> following(
            @PathVariable Long userId, @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(50) int size) {
        return service.following(userId, page, size);
    }
}

package com.companion.controllers;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.user.UserAccountResponseDTO;
import com.companion.dtos.user.UserProfileUpdateRequestDTO;
import com.companion.dtos.user.UserPublicResponseDTO;
import com.companion.services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserAccountResponseDTO me() {
        return userService.getCurrentAccount();
    }

    @PutMapping("/me/profile")
    public UserAccountResponseDTO updateMyProfile(@Valid @RequestBody UserProfileUpdateRequestDTO request) {
        return userService.updateOwnProfile(request);
    }

    @PostMapping("/me/onboarding/complete")
    public UserAccountResponseDTO completeOnboarding() {
        return userService.completeOnboarding();
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyAccount() {
        userService.deleteOwnAccount();
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public UserPublicResponseDTO profile(@PathVariable Long id) {
        return userService.getPublicProfile(id);
    }

    @GetMapping
    public PageResponse<UserPublicResponseDTO> search(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size
    ) {
        return userService.search(query, page, size);
    }
}

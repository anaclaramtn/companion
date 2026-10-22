package com.companion.controllers;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.user.UserAdminResponseDTO;
import com.companion.dtos.user.UserRoleUpdateRequestDTO;
import com.companion.dtos.user.UserStatusUpdateRequestDTO;
import com.companion.services.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public PageResponse<UserAdminResponseDTO> list(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size
    ) {
        return userService.listForAdministration(query, page, size);
    }

    @PatchMapping("/{id}/role")
    public UserAdminResponseDTO changeRole(@PathVariable Long id,
                                            @Valid @RequestBody UserRoleUpdateRequestDTO request) {
        return userService.changeRole(id, request);
    }

    @PatchMapping("/{id}/status")
    public UserAdminResponseDTO changeStatus(@PathVariable Long id,
                                              @Valid @RequestBody UserStatusUpdateRequestDTO request) {
        return userService.changeStatus(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteByAdministration(id);
        return ResponseEntity.noContent().build();
    }
}

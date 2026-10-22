package com.companion.controllers;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.report.*;
import com.companion.enums.ReportStatus;
import com.companion.services.ReportService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@Validated
@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportService service;
    public ReportController(ReportService service) { this.service = service; }
    @PostMapping public ResponseEntity<ReportResponseDTO> create(@Valid @RequestBody ReportCreateRequestDTO request) {
        ReportResponseDTO response = service.create(request);
        return ResponseEntity.created(URI.create("/api/reports/" + response.id())).body(response);
    }
    @GetMapping @PreAuthorize("hasAnyRole('MODERATOR','ADMIN')")
    public PageResponse<ReportResponseDTO> list(@RequestParam(required = false) ReportStatus status,
                                                @RequestParam(defaultValue = "0") @Min(0) int page,
                                                @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return service.list(status, page, size);
    }
    @GetMapping("/{id}") @PreAuthorize("hasAnyRole('MODERATOR','ADMIN')")
    public ReportResponseDTO get(@PathVariable Long id) { return service.get(id); }
    @PatchMapping("/{id}") @PreAuthorize("hasAnyRole('MODERATOR','ADMIN')")
    public ReportResponseDTO review(@PathVariable Long id, @Valid @RequestBody ReportReviewRequestDTO request) {
        return service.review(id, request);
    }
}

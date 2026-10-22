package com.companion.controllers;

import com.companion.dtos.common.PageResponse;
import com.companion.dtos.faq.*;
import com.companion.services.FaqService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@Validated
@RestController
@RequestMapping("/api/admin/faqs")
public class AdminFaqController {
    private final FaqService service;
    public AdminFaqController(FaqService service) { this.service = service; }
    @GetMapping public PageResponse<FaqResponseDTO> list(@RequestParam(defaultValue = "0") @Min(0) int page,
                                                         @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return service.all(page, size);
    }
    @PostMapping public ResponseEntity<FaqResponseDTO> create(@Valid @RequestBody FaqRequestDTO request) {
        FaqResponseDTO response = service.create(request);
        return ResponseEntity.created(URI.create("/api/faqs/" + response.id())).body(response);
    }
    @PutMapping("/{id}") public FaqResponseDTO update(@PathVariable Long id,
                                                       @Valid @RequestBody FaqRequestDTO request) {
        return service.update(id, request);
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id); return ResponseEntity.noContent().build();
    }
}

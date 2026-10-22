package com.companion.controllers;

import com.companion.dtos.faq.FaqResponseDTO;
import com.companion.services.FaqService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faqs")
public class FaqController {
    private final FaqService service;
    public FaqController(FaqService service) { this.service = service; }
    @GetMapping public List<FaqResponseDTO> list() { return service.active(); }
    @GetMapping("/{id}") public FaqResponseDTO get(@PathVariable Long id) { return service.activeById(id); }
}

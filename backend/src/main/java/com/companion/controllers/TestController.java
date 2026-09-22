package com.companion.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public Map<String, Object> test() {
        return Map.of(
                "application", "Companion",
                "status", "online",
                "message", "Backend funcionando!"
        );
    }
}
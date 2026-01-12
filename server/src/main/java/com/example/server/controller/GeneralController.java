package com.example.server.controller;

import com.example.server.dto.GeneralDtos.SystemStatsResponse;
import com.example.server.service.GeneralService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/general")
@RequiredArgsConstructor
public class GeneralController {

    private final GeneralService generalService;

    @GetMapping("/stats")
    public ResponseEntity<SystemStatsResponse> getSystemStats() {
        return ResponseEntity.ok(generalService.getSystemStats());
    }
}
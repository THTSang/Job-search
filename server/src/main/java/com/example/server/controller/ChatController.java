package com.example.server.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dto.ChatDtos.ChatMessageResponse;
import com.example.server.security.CustomUserDetails;
import com.example.server.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Lấy lịch sử chat với một user cụ thể
    @GetMapping("/{recipientId}")
    public ResponseEntity<Page<ChatMessageResponse>> getChatHistory(
            @PathVariable String recipientId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        
        String currentUserId = userDetails.getId();

        return ResponseEntity.ok(chatService.getChatHistory(currentUserId, recipientId, pageable));
    }
}
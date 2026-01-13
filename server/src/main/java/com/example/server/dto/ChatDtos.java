package com.example.server.dto;

import java.time.Instant;

import jakarta.validation.constraints.NotBlank;

public class ChatDtos {

    public record SendMessageRequest(
        @NotBlank String recipientId,
        @NotBlank String content
    ) {}

    public record ChatMessageResponse(
        String id, String senderId, String recipientId, String content, Instant createdAt
    ) {}
}
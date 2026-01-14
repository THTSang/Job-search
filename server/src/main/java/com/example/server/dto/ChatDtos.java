package com.example.server.dto;

import java.time.Instant;

import jakarta.validation.constraints.NotBlank;

public class ChatDtos {

    public record SendMessageRequest(
        @NotBlank String recipientId,
        @NotBlank String content
    ) {}

    // Request bắt đầu cuộc trò chuyện mới
    public record StartChatRequest(
        @NotBlank String recipientId
    ) {}

    // Response trả về thông tin init cho khung chat
    public record StartChatResponse(
        String chatId, String partnerId, String partnerName
    ) {}

    public record ChatMessageResponse(
        String id, String senderId, String recipientId, String content, Instant createdAt
    ) {}

    // DTO cho danh sách cuộc trò chuyện (Inbox)
    public record ConversationResponse(
        String chatId,
        String partnerId,   // ID của người chat cùng
        String partnerName, // Tên hiển thị của người chat cùng
        String lastMessage, // Nội dung tin nhắn cuối cùng
        Instant lastMessageAt,
        boolean isRead      // Trạng thái đã đọc (Optional - logic mở rộng sau)
    ) {}
}
package com.example.server.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_messages")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatMessage {
    @Id
    private String id;
    private String chatId; // Unique ID cho cuộc hội thoại (ví dụ: senderId_recipientId sorted)
    private String senderId;
    private String recipientId;
    private String content;
    private Instant createdAt;
    private MessageStatus status; // SENT, DELIVERED, READ
}
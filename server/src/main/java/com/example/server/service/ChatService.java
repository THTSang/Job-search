package com.example.server.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.server.dto.ChatDtos.ChatMessageResponse;
import com.example.server.model.ChatMessage;

public interface ChatService {
    ChatMessage save(String senderId, String recipientId, String content);
    Page<ChatMessageResponse> getChatHistory(String userId1, String userId2, Pageable pageable);
}
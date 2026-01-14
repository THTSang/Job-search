package com.example.server.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.server.model.ChatMessage;

public interface ChatMessageRepositoryCustom {
    Page<ChatMessage> findConversations(String userId, Pageable pageable);
}
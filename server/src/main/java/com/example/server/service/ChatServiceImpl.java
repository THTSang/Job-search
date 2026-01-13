package com.example.server.service;

import java.time.Instant;
import java.util.Arrays;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.server.dto.ChatDtos.ChatMessageResponse;
import com.example.server.model.ChatMessage;
import com.example.server.model.MessageStatus;
import com.example.server.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;

    @Override
    public ChatMessage save(String senderId, String recipientId, String content) {
        String chatId = getChatId(senderId, recipientId);
        
        ChatMessage message = ChatMessage.builder()
                .chatId(chatId)
                .senderId(senderId)
                .recipientId(recipientId)
                .content(content)
                .status(MessageStatus.SENT)
                .createdAt(Instant.now())
                .build();

        return chatMessageRepository.save(message);
    }

    @Override
    public Page<ChatMessageResponse> getChatHistory(String userId1, String userId2, Pageable pageable) {
        String chatId = getChatId(userId1, userId2);
        return chatMessageRepository.findByChatId(chatId, pageable)
                .map(this::toDto);
    }

    // Tạo ID hội thoại duy nhất bằng cách sắp xếp ID của 2 người
    private String getChatId(String senderId, String recipientId) {
        String[] ids = {senderId, recipientId};
        Arrays.sort(ids);
        return ids[0] + "_" + ids[1];
    }

    private ChatMessageResponse toDto(ChatMessage msg) {
        return new ChatMessageResponse(
            msg.getId(), msg.getSenderId(), msg.getRecipientId(), msg.getContent(), msg.getCreatedAt()
        );
    }
}
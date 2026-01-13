package com.example.server.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.server.dto.ChatDtos.ChatMessageResponse;
import com.example.server.dto.ChatDtos.SendMessageRequest;
import com.example.server.model.ChatMessage;
import com.example.server.service.ChatService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    // Client gửi tới: /app/chat
    @MessageMapping("/chat")
    public void processMessage(@Payload SendMessageRequest request, Principal principal) {
        String senderId = principal.getName(); // Lấy từ Authentication set trong WebSocketConfig

        // 1. Lưu vào DB
        ChatMessage savedMsg = chatService.save(senderId, request.recipientId(), request.content());

        // 2. Gửi realtime cho người nhận
        // Client người nhận subscribe: /user/queue/messages
        ChatMessageResponse response = new ChatMessageResponse(
            savedMsg.getId(), savedMsg.getSenderId(), savedMsg.getRecipientId(), savedMsg.getContent(), savedMsg.getCreatedAt()
        );
        
        messagingTemplate.convertAndSendToUser(
            request.recipientId(), 
            "/queue/messages", 
            response
        );
        
        // 3. Gửi lại cho người gửi (để hiển thị ngay lập tức trên UI của họ nếu cần confirm từ server)
        messagingTemplate.convertAndSendToUser(
            senderId,
            "/queue/messages",
            response
        );
    }
}
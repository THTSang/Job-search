package com.example.server.service;

import java.time.Instant;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.server.dto.ChatDtos.ConversationResponse;
import com.example.server.dto.ChatDtos.ChatMessageResponse;
import com.example.server.model.ChatMessage;
import com.example.server.model.MessageStatus;
import com.example.server.model.User;
import com.example.server.repository.ChatMessageRepository;
import com.example.server.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository; // Inject UserRepository để lấy tên người chat

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
        // 1. Xác định Chat ID (Data Model 2.7):
        // Luôn sort 2 ID để đảm bảo (A chat với B) và (B chat với A) đều dùng chung 1 chatId.
        String chatId = getChatId(userId1, userId2);
        
        // 2. Query DB & Map to DTO (Coding Vibe):
        return chatMessageRepository.findByChatId(chatId, pageable)
                .map(this::toDto);
    }

    @Override
    public Page<ConversationResponse> getConversations(String userId, Pageable pageable) {
        // 1. Lấy danh sách tin nhắn mới nhất của từng hội thoại từ DB
        Page<ChatMessage> latestMessages = chatMessageRepository.findConversations(userId, pageable);

        // 2. Thu thập ID của những người chat cùng (Partner IDs)
        Set<String> partnerIds = latestMessages.stream()
                .map(msg -> msg.getSenderId().equals(userId) ? msg.getRecipientId() : msg.getSenderId())
                .collect(Collectors.toSet());

        // 3. Fetch thông tin User của các partner (Batch query để tránh N+1)
        Map<String, User> partnerMap = userRepository.findAllById(partnerIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        // 4. Map sang DTO
        return latestMessages.map(msg -> {
            String partnerId = msg.getSenderId().equals(userId) ? msg.getRecipientId() : msg.getSenderId();
            User partner = partnerMap.get(partnerId);
            String partnerName = (partner != null) ? partner.getName() : "Unknown User";

            return new ConversationResponse(
                msg.getChatId(),
                partnerId,
                partnerName,
                msg.getContent(),
                msg.getCreatedAt(),
                msg.getStatus() == MessageStatus.READ // Logic đơn giản, có thể cải tiến sau
            );
        });
    }

    // Helper: Tạo ID hội thoại duy nhất (Composite Key Logic)
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
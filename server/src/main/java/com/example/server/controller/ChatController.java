package com.example.server.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import com.example.server.dto.UserDtos.UserSummaryDto;
import com.example.server.dto.ChatDtos.StartChatRequest;
import com.example.server.dto.ChatDtos.StartChatResponse;
import com.example.server.dto.ChatDtos.ChatMessageResponse;
import com.example.server.dto.ChatDtos.ConversationResponse;
import com.example.server.security.CustomUserDetails;
import com.example.server.service.ChatService;
import com.example.server.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    // Endpoint: POST /api/chat/start
    // Bắt đầu cuộc trò chuyện mới (Init)
    @PostMapping("/start")
    public ResponseEntity<StartChatResponse> startChat(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody StartChatRequest request) {
        return ResponseEntity.ok(chatService.startChat(userDetails.getId(), request.recipientId()));
    }

    // Endpoint: GET /api/chat/{recipientId}
    @GetMapping("/{recipientId}")
    public ResponseEntity<Page<ChatMessageResponse>> getChatHistory(
            @PathVariable String recipientId,
            // Security: Lấy ID user đang đăng nhập để đảm bảo quyền truy cập
            @AuthenticationPrincipal CustomUserDetails userDetails,
            // Pagination: Mặc định lấy 20 tin nhắn mới nhất (createdAt DESC) theo quy chuẩn API
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        
        String currentUserId = userDetails.getId();

        // Logic: Chỉ trả về tin nhắn giữa user hiện tại và recipientId
        return ResponseEntity.ok(chatService.getChatHistory(currentUserId, recipientId, pageable));
    }

    // Lấy danh sách các cuộc trò chuyện (Inbox)
    @GetMapping("/conversations")
    public ResponseEntity<Page<ConversationResponse>> getConversations(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        
        String currentUserId = userDetails.getId();
        return ResponseEntity.ok(chatService.getConversations(currentUserId, pageable));
    }

    // Endpoint: GET /api/chat/users/search?query=<string>&page=0&size=20
    // Tìm kiếm user để bắt đầu chat (theo email hoặc tên)
    @GetMapping("/users/search")
    public ResponseEntity<Page<UserSummaryDto>> searchUsers(
            @RequestParam String query,
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        
        return ResponseEntity.ok(
            userService.searchUsers(query, pageable)
                .map(u -> new UserSummaryDto(u.getId(), u.getName(), u.getEmail(), u.getRole()))
        );
    }
}
package com.example.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.example.server.security.CustomUserDetailsService;
import com.example.server.security.JwtUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        String[] origins = allowedOrigins.split(",");
        
        // 1. Native WebSocket Endpoint (Quan trọng cho WSS trực tiếp)
        // Giúp client kết nối qua wss://api.domain.com/ws mà không cần SockJS handshake
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(origins);

        // 2. SockJS Endpoint (Fallback)
        // Hỗ trợ các browser cũ hoặc client sử dụng thư viện SockJS
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns(origins)
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefix cho các message gửi từ server -> client
        registry.enableSimpleBroker("/topic", "/queue");
        // Prefix cho các message gửi từ client -> server
        registry.setApplicationDestinationPrefixes("/app");
        // Prefix cho private message (gửi riêng cho user)
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                // Chỉ kiểm tra khi client cố gắng CONNECT
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // Lấy token từ header Authorization
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    String token = null;
                    
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        token = authHeader.substring(7); // Cắt bỏ "Bearer "
                    } else if (accessor.getFirstNativeHeader("token") != null) {
                        // Fallback: Lấy từ header 'token' (nếu client gửi custom header này)
                        token = accessor.getFirstNativeHeader("token");
                    }

                    if (token != null && jwtUtils.validateToken(token)) {
                        String userId = jwtUtils.getUserIdFromToken(token);
                        // Load user details để có Role (nếu cần)
                        // Lưu ý: userId trong token chính là ID trong DB
                        // Để tối ưu hiệu năng, có thể tạo Principal giả chỉ có ID, nhưng ở đây dùng full flow cho an toàn
                        // Tuy nhiên, vì UserDetailsService cần email, ta cần check lại JwtUtils.
                        // Cách đơn giản nhất: Tạo Principal chỉ chứa ID (vì ta chỉ cần ID để chat)
                        
                        UsernamePasswordAuthenticationToken auth = 
                            new UsernamePasswordAuthenticationToken(userId, null, java.util.Collections.emptyList());
                        
                        accessor.setUser(auth);
                    }
                }
                return message;
            }
        });
    }
}
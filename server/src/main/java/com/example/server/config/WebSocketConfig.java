package com.example.server.config;

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

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint để client kết nối: ws://localhost:8080/ws
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Cấu hình CORS cho WebSocket
                .withSockJS(); // Fallback nếu browser không hỗ trợ WS
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
                    // Lấy token từ header 'Authorization' (nếu client gửi được) hoặc query param (dễ hơn cho JS client)
                    // Ở đây giả định client gửi dạng: ws://localhost:8080/ws?token=xyz
                    String token = accessor.getFirstNativeHeader("Authorization");
                    
                    // Nếu không có header, thử lấy từ query param (cần logic parse custom nếu dùng SockJS thuần, 
                    // nhưng để đơn giản ta ưu tiên check header 'Authorization' hoặc 'token' trong nativeHeaders)
                    if (token == null && accessor.getNativeHeader("token") != null) {
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
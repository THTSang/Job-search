package com.example.server.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Value;

import com.example.server.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Kích hoạt @PreAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults()) // Kích hoạt CORS (quan trọng cho WebSocket từ client khác domain/port)
            .csrf(csrf -> csrf.disable()) // Stateless API không cần CSRF
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/login").permitAll() // Public Login
                // Mentor Note: Chỉ cho phép POST (Đăng ký) public, còn GET (List users) sẽ yêu cầu Auth
                .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                // Fix: Cho phép xác thực email (Public) vì user click link từ mail chưa có token
                .requestMatchers(HttpMethod.GET, "/api/users/verify/**").permitAll()
                // Fix: Cho phép quên mật khẩu và đặt lại mật khẩu (Public)
                .requestMatchers(HttpMethod.POST, "/api/users/forgot-password", "/api/users/reset-password").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/search").permitAll() // Search Job (Public)
                .requestMatchers(HttpMethod.GET, "/api/jobs/{id}").permitAll()    // Job Detail (Public)
                .requestMatchers(HttpMethod.GET, "/api/companies/{id}").permitAll() // Company Detail (Public)
                .requestMatchers(HttpMethod.GET, "/api/general/stats").permitAll() // General Stats (Public)
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/ws/**").permitAll() // Allow WebSocket Handshake
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Định nghĩa Bean PasswordEncoder (BCrypt) để Spring Context quản lý
    // Bean này sẽ được inject vào UserServiceImpl để hash mật khẩu người dùng
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Sử dụng setAllowedOriginPatterns thay vì setAllowedOrigins để hỗ trợ wildcard "*"
        // khi allowCredentials = true
        configuration.setAllowedOriginPatterns(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
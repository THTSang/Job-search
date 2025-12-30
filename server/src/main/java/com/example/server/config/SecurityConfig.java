package com.example.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Tắt CSRF vì ứng dụng sử dụng JWT (Stateless) thay vì Session/Cookies
            .csrf(AbstractHttpConfigurer::disable)

            // Kích hoạt CORS: Spring Security sẽ sử dụng Bean CorsConfigurationSource 
            // (thường được define trong CorsConfig hoặc tự động nếu có WebMvcConfigurer)
            .cors(Customizer.withDefaults())

            // Thiết lập Session Management là Stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Cấu hình phân quyền (Authorization)
            .authorizeHttpRequests(auth -> auth
                // Cho phép truy cập Swagger UI và API Docs
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                // Cho phép Public truy cập danh sách việc làm (theo User Story US-05)
                .requestMatchers(HttpMethod.GET, "/api/jobs/**").permitAll()

                // Tất cả các request còn lại bắt buộc phải có Token hợp lệ
                .anyRequest().authenticated()
            )

            // Cấu hình OAuth2 Resource Server để xác thực JWT
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
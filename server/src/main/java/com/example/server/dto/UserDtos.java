package com.example.server.dto;

import com.example.server.model.UserRole;
import com.example.server.model.UserStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserDtos {
    public record UserDto(String id, String email, String name, UserRole role, UserStatus status) {}
    public record CreateUserDto(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 3, max = 50) String name,
            @NotBlank @Size(min = 8, max = 100) String password,
            UserRole role
    ) {}
    public record UpdateUserDto(
            @Size(min = 3, max = 50) String name,
            @Size(min = 8, max = 100) String password,
            UserRole role,
            UserStatus status
    ) {}
    public record ChangeStatusDto(
            @NotNull UserStatus status
    ) {}
    
    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {}

    public record LoginResponse(String token) {}

    public record ForgotPasswordRequest(@Email @NotBlank String email) {}

    public record ResetPasswordRequest(
        @NotBlank String token,
        @NotBlank @Size(min = 8, max = 100) String newPassword
    ) {}

    // Dùng cho response đơn giản
    public record MessageResponse(String message) {}
}

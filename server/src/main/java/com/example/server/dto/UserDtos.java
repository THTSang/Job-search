package com.example.server.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDtos {
    public record UserDto(String id, String email, String name, String role) {}
    public record CreateUserDto(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 3, max = 50) String name,
            @NotBlank @Size(min = 8, max = 100) String password,
            String role
    ) {}
    public record SyncUserDto(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 3, max = 50) String name,
            String role
    ) {}
    public record UpdateUserDto(
            @Size(min = 3, max = 50) String name,
            @Size(min = 8, max = 100) String password,
            String role
    ) {}
}

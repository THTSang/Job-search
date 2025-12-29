package com.example.server.dto;

import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDtos {
    public record UserDto(String id, String email, String name, Set<String> roles) {}
    public record CreateUserDto(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 3, max = 50) String name,
            @NotBlank @Size(min = 8, max = 100) String password,
            Set<String> roles
    ) {}
    public record SyncUserDto(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 3, max = 50) String name,
            Set<String> roles
    ) {}
    public record UpdateUserDto(
            @Size(min = 3, max = 50) String name,
            @Size(min = 8, max = 100) String password,
            Set<String> roles
    ) {}
}

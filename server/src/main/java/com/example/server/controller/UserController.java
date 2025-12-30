package com.example.server.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import com.example.server.dto.UserDtos;
import com.example.server.model.User;
import com.example.server.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public Page<UserDtos.UserDto> list(Pageable pageable) {
        return service.list(pageable).map(this::toDto);
    }

    @GetMapping("/{id}")
    public UserDtos.UserDto get(@PathVariable String id) {
        return toDto(service.get(id));
    }

    /**
     * Endpoint này đóng vai trò là "Đăng ký" hoặc "Sync User" sau khi login Auth0.
     * Frontend gọi endpoint này kèm Token. Backend sẽ tạo user nếu chưa tồn tại
     * dựa trên 'sub' (Auth0 ID) trong token.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDtos.UserDto create(@Valid @RequestBody UserDtos.CreateUserDto dto) {
        User created = service.create(dto);
        return toDto(created);
    }

    @PostMapping("/sync")
    @ResponseStatus(HttpStatus.OK)
    public UserDtos.UserDto syncUser(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody UserDtos.SyncUserDto dto) {
        String auth0Id = jwt.getSubject();
        User syncedUser = service.syncUser(auth0Id, dto);
        return toDto(syncedUser);
    }

    @PutMapping("/{id}")
    public UserDtos.UserDto update(@PathVariable String id, @Valid @RequestBody UserDtos.UpdateUserDto dto) {
        return toDto(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    private UserDtos.UserDto toDto(User u) {
        return new UserDtos.UserDto(u.getId(), u.getEmail(), u.getName(), u.getRole(), u.getStatus());
    }
}

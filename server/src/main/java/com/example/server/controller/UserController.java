package com.example.server.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;

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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserDtos.UserDto>> list(
            // Mentor Note: Mặc định sort theo tên A-Z cho danh sách user
            @PageableDefault(size = 20, sort = "name", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return ResponseEntity.ok(service.list(pageable).map(this::toDto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDtos.UserDto> get(@PathVariable String id) {
        return ResponseEntity.ok(toDto(service.get(id)));
    }

    /**
     * Đăng ký tài khoản mới (Public).
     */
    @PostMapping
    public ResponseEntity<UserDtos.UserDto> create(@Valid @RequestBody UserDtos.CreateUserDto dto) {
        User created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(created));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDtos.LoginResponse> login(@Valid @RequestBody UserDtos.LoginRequest request) {
        String token = service.login(request.email(), request.password());
        return ResponseEntity.ok(new UserDtos.LoginResponse(token));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDtos.UserDto> update(@PathVariable String id, @Valid @RequestBody UserDtos.UpdateUserDto dto) {
        return ResponseEntity.ok(toDto(service.update(id, dto)));
    }

    /**
     * Endpoint dành riêng cho Admin để thay đổi trạng thái User (Ban/Unban).
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDtos.UserDto> changeStatus(@PathVariable String id, @Valid @RequestBody UserDtos.ChangeStatusDto dto) {
        // Reuse logic update của Service, map ChangeStatusDto -> UpdateUserDto
        UserDtos.UpdateUserDto updateDto = new UserDtos.UpdateUserDto(null, null, null, dto.status());
        return ResponseEntity.ok(toDto(service.update(id, updateDto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    private UserDtos.UserDto toDto(User u) {
        return new UserDtos.UserDto(u.getId(), u.getEmail(), u.getName(), u.getRole(), u.getStatus());
    }
}

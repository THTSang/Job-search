package com.example.server.service;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.server.dto.UserDtos;
import com.example.server.exception.NotFoundException;
import com.example.server.model.User;
import com.example.server.model.UserRole;
import com.example.server.model.UserStatus;
import com.example.server.repository.UserRepository;
import com.example.server.security.JwtUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public Page<User> list(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public User get(String id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
    }

    @Override
    public User create(UserDtos.CreateUserDto dto) {
        // Check email duplicate để báo lỗi rõ ràng
        if (repository.findByEmail(dto.email()).isPresent()) {
            throw new IllegalArgumentException("Email already exists: " + dto.email());
        }

        User u = User.builder()
                .email(dto.email())
                .name(dto.name())
                .passwordHash(passwordEncoder.encode(dto.password()))
                .role(dto.role() != null ? dto.role() : UserRole.USER)
                .status(UserStatus.ACTIVE)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        return repository.save(u);
    }

    @Override
    public String login(String email, String password) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }
        
        return jwtUtils.generateToken(user);
    }

    @Override
    public User update(String id, UserDtos.UpdateUserDto dto) {
        // Optimization: Nếu chỉ update status, dùng atomic update từ Custom Repository
        if (dto.status() != null && dto.name() == null && dto.password() == null && dto.role() == null) {
            User updated = repository.updateStatus(id, dto.status());
            if (updated == null) throw new NotFoundException("User not found");
            return updated;
        }

        User u = get(id);
        if (StringUtils.hasText(dto.name())) u.setName(dto.name());
        if (StringUtils.hasText(dto.password())) u.setPasswordHash(passwordEncoder.encode(dto.password()));
        if (dto.role() != null) u.setRole(dto.role());
        if (dto.status() != null) u.setStatus(dto.status());
        u.setUpdatedAt(Instant.now());
        return repository.save(u);
    }

    @Override
    public void delete(String id) {
        if (!repository.existsById(id)) throw new NotFoundException("User not found");
        repository.deleteById(id);
    }
}
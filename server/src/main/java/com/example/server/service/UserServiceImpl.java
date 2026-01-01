package com.example.server.service;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.server.dto.UserDtos;
import com.example.server.exception.NotFoundException;
import com.example.server.model.User;
import com.example.server.model.UserRole;
import com.example.server.model.UserStatus;
import com.example.server.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

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
        User u = new User();
        u.setEmail(dto.email());
        u.setName(dto.name());
        u.setPasswordHash(passwordEncoder.encode(dto.password()));
        u.setRole(dto.role() != null ? dto.role() : UserRole.USER);
        u.setStatus(UserStatus.ACTIVE);
        u.setCreatedAt(Instant.now());
        u.setUpdatedAt(Instant.now());
        return repository.save(u);
    }

    @Override
    public User syncUser(String auth0Id, UserDtos.SyncUserDto dto) {
        return repository.findByAuth0Id(auth0Id)
                .map(existing -> {
                    // Case 1: User đã tồn tại với Auth0 ID -> Update info
                    existing.setEmail(dto.email());
                    existing.setName(dto.name());
                    existing.setRole(dto.role() != null ? dto.role() : UserRole.USER);
                    existing.setUpdatedAt(Instant.now());
                    return repository.save(existing);
                })
                .orElseGet(() -> repository.findByEmail(dto.email())
                        .map(existing -> {
                            // Case 2: User chưa có Auth0 ID nhưng có email trùng -> Link account
                            existing.setAuth0Id(auth0Id);
                            existing.setName(dto.name());
                            existing.setRole(dto.role() != null ? dto.role() : UserRole.USER);
                            existing.setUpdatedAt(Instant.now());
                            return repository.save(existing);
                        })
                        .orElseGet(() -> {
                            // Case 3: User mới hoàn toàn -> Create new
                            User newUser = User.builder()
                                    .email(dto.email())
                                    .name(dto.name())
                                    .auth0Id(auth0Id)
                                    .role(dto.role() != null ? dto.role() : UserRole.USER)
                                    .status(UserStatus.ACTIVE)
                                    .createdAt(Instant.now())
                                    .updatedAt(Instant.now())
                                    .build();
                            return repository.save(newUser);
                        }));
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
package com.example.server.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.server.dto.UserDtos;
import com.example.server.exception.NotFoundException;
import com.example.server.model.User;
import com.example.server.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> list() {
        return repository.findAll();
    }

    public User get(String id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User create(UserDtos.CreateUserDto dto) {
        User u = new User();
        u.setEmail(dto.email());
        u.setName(dto.name());
        // In production hash password with BCrypt. Here store a simple placeholder.
        u.setPasswordHash("{noop}" + dto.password());
        u.setRoles(dto.roles());
        u.setCreatedAt(Instant.now());
        u.setUpdatedAt(Instant.now());
        return repository.save(u);
    }

    public User update(String id, UserDtos.UpdateUserDto dto) {
        User u = get(id);
        if (StringUtils.hasText(dto.name())) u.setName(dto.name());
        if (StringUtils.hasText(dto.password())) u.setPasswordHash("{noop}" + dto.password());
        if (dto.roles() != null) u.setRoles(dto.roles());
        u.setUpdatedAt(Instant.now());
        return repository.save(u);
    }

    public void delete(String id) {
        if (!repository.existsById(id)) throw new NotFoundException("User not found");
        repository.deleteById(id);
    }
}
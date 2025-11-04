package com.example.server.controller;

import java.util.List;
import java.util.stream.Collectors;

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
    public List<UserDtos.UserDto> list() {
        return service.list().stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserDtos.UserDto get(@PathVariable String id) {
        return toDto(service.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDtos.UserDto create(@Valid @RequestBody UserDtos.CreateUserDto dto) {
        User created = service.create(dto);
        return toDto(created);
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
        return new UserDtos.UserDto(u.getId(), u.getEmail(), u.getName(), u.getRoles());
    }
}

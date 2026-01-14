package com.example.server.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.server.dto.UserDtos;
import com.example.server.model.User;

public interface UserService {
    Page<User> list(Pageable pageable);
    User get(String id);
    User create(UserDtos.CreateUserDto dto);
    String login(String email, String password);
    User update(String id, UserDtos.UpdateUserDto dto);
    void delete(String id);
    void verifyEmail(String token);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
    Page<User> searchUsers(String query, Pageable pageable);
}
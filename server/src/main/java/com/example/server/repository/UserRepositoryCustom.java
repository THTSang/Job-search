package com.example.server.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.server.model.User;
import com.example.server.model.UserStatus;

/**
 * Interface định nghĩa các method truy vấn tùy chỉnh cho User.
 * Giúp mở rộng khả năng của Spring Data MongoDB (Dynamic Query).
 */
public interface UserRepositoryCustom {
    Page<User> searchUsers(String keyword, Pageable pageable);
    User updateStatus(String id, UserStatus status);
}
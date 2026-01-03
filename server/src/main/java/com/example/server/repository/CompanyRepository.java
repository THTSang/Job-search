package com.example.server.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Company;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {

    // Tìm công ty do một Recruiter cụ thể tạo ra (Logic 1 Recruiter - 1 Company)
    Optional<Company> findByRecruiterId(String recruiterId);

    // Kiểm tra tên công ty đã tồn tại chưa để tránh trùng lặp
    boolean existsByName(String name);
}
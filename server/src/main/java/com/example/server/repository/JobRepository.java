package com.example.server.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Job;

@Repository
public interface JobRepository extends MongoRepository<Job, String>, JobRepositoryCustom {
    Page<Job> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    // Thay thế tìm theo tên (không còn field company) bằng tìm theo ID chính xác
    List<Job> findByCompanyId(String companyId);
}
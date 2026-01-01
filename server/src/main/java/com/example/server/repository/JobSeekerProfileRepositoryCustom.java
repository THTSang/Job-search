package com.example.server.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.server.model.JobSeekerProfile;

/**
 * Interface định nghĩa các method truy vấn tùy chỉnh (Custom Queries) cho Profile.
 * Pattern này giúp mở rộng khả năng của Spring Data MongoDB.
 */
public interface JobSeekerProfileRepositoryCustom {
    // Mentor Note: Định nghĩa hàm tìm kiếm profile theo keyword (tên, chức danh...)
    Page<JobSeekerProfile> searchProfiles(String keyword, Pageable pageable);
}
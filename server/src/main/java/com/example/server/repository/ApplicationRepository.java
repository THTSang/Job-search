package com.example.server.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Application;
import com.example.server.model.ApplicationStatus;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {

    // Mentor Note: Tìm danh sách đơn ứng tuyển của một ứng viên cụ thể (My Applications)
    // Hỗ trợ phân trang để hiển thị danh sách dài.
    Page<Application> findAllByJobSeekerId(String jobSeekerId, Pageable pageable);

    // Tìm danh sách đơn ứng tuyển cho một Job cụ thể (Dành cho Recruiter)
    Page<Application> findAllByJobId(String jobId, Pageable pageable);

    // Mentor Note: Kiểm tra xem ứng viên đã nộp đơn vào Job này chưa
    // Dùng để chặn việc nộp đơn trùng lặp (Duplicate Application) ngay từ tầng DB.
    boolean existsByJobSeekerIdAndJobId(String jobSeekerId, String jobId);

    // Tìm đơn ứng tuyển cụ thể của user cho job (để lấy chi tiết status/date)
    Optional<Application> findByJobSeekerIdAndJobId(String jobSeekerId, String jobId);

    // --- Stats Methods (Dashboard) ---

    // Đếm tổng số đơn đã nộp của ứng viên
    long countByJobSeekerId(String jobSeekerId);

    // Đếm số đơn theo trạng thái (ví dụ: bao nhiêu đơn đang PENDING, bao nhiêu OFFERED)
    long countByJobSeekerIdAndStatus(String jobSeekerId, ApplicationStatus status);
}
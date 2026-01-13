package com.example.server.dto;

import java.time.Instant;

import com.example.server.model.ApplicationStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ApplicationDtos {

    // --- Helper DTOs (Nested in Response) ---
    // Mentor Note: Dùng để hiển thị thông tin tóm tắt của Job và Company trong danh sách đơn ứng tuyển.
    // Giúp giảm payload so với việc trả về full JobDto.
    public record JobSummary(String id, String title) {}
    public record CompanySummary(String name, String logoUrl) {}

    // --- Recruiter View DTOs ---
    public record ApplicantSummary(
        String id,              // User ID (JobSeeker ID)
        String fullName,
        String email,
        String avatarUrl,
        String professionalTitle
    ) {}

    public record RecruiterApplicationDto(
        String id,              // Application ID
        ApplicantSummary applicant,
        ApplicationStatus status,
        Instant appliedAt,
        String resumeUrl,
        String coverLetter
    ) {}

    // --- 1. Response DTO ---
    public record ApplicationResponse(
        String id,
        JobSummary job,           // Lồng object con
        CompanySummary company,   // Lồng object con
        ApplicationStatus status,
        Instant appliedAt
    ) {}

    // --- 2. Stats DTO ---
    // Mentor Note: Dùng cho Dashboard thống kê của ứng viên.
    public record ApplicationStats(
        long total,
        long pending,
        long interviewing,
        long offered
        // Có thể thêm rejected/cancelled nếu cần sau này
    ) {}

    // --- 3. Request DTO ---
    public record ApplyRequest(
        @NotBlank(message = "Job ID is required")
        String jobId,

        @NotBlank(message = "Resume URL is required")
        String resumeUrl,

        String coverLetter // Optional, không bắt buộc validate
    ) {}

    // --- 4. Update Status DTO ---
    public record UpdateApplicationStatusDto(
        @NotNull(message = "Status is required")
        ApplicationStatus status,
        String note // Ghi chú tùy chọn (ví dụ: lý do từ chối)
    ) {}

    // --- 5. Check Status DTO ---
    public record ApplicationCheckResponse(
        boolean hasApplied,
        String applicationId,
        ApplicationStatus status,
        Instant appliedAt
    ) {}

    // --- 6. Count Response DTO ---
    // Mentor Note: Dùng để hiển thị số lượng ứng viên đã nộp đơn (ví dụ: "Over 50 applicants")
    public record ApplicationCountResponse(
        long count
    ) {}
}
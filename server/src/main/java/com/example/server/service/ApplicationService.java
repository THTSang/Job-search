package com.example.server.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.server.dto.ApplicationDtos.ApplicationCheckResponse;
import com.example.server.dto.ApplicationDtos.ApplicationResponse;
import com.example.server.dto.ApplicationDtos.ApplicationCountResponse;
import com.example.server.dto.ApplicationDtos.ApplicationStats;
import com.example.server.dto.ApplicationDtos.ApplyRequest;
import com.example.server.dto.ApplicationDtos.RecruiterApplicationDto;
import com.example.server.dto.ApplicationDtos.UpdateApplicationStatusDto;

/**
 * Service Interface cho nghiệp vụ Ứng tuyển (Recruitment).
 */
public interface ApplicationService {

    /**
     * Xử lý ứng viên nộp đơn vào một công việc.
     * @param jobSeekerId ID của người tìm việc (lấy từ Token).
     * @param request DTO chứa jobId và resumeUrl.
     * @return ApplicationResponse thông tin đơn vừa tạo.
     */
    ApplicationResponse create(String jobSeekerId, ApplyRequest request);

    /**
     * Lấy danh sách đơn ứng tuyển của ứng viên (My Applications).
     * @param jobSeekerId ID của người tìm việc.
     * @param pageable Thông tin phân trang (page, size, sort).
     * @return Page các ApplicationResponse (kèm thông tin Job/Company tóm tắt).
     */
    Page<ApplicationResponse> getMyApplications(String jobSeekerId, Pageable pageable);

    /**
     * Lấy thống kê số lượng đơn theo trạng thái cho Dashboard.
     * @param jobSeekerId ID của người tìm việc.
     * @return ApplicationStats.
     */
    ApplicationStats getMyStats(String jobSeekerId);

    ApplicationResponse updateStatus(String applicationId, String recruiterId, UpdateApplicationStatusDto dto);

    /**
     * Lấy danh sách ứng viên đã nộp đơn vào một Job (Dành cho Recruiter).
     * @param jobId ID của Job.
     * @param recruiterId ID của Recruiter (để check quyền sở hữu).
     * @param pageable Phân trang.
     * @return Page<RecruiterApplicationDto> chứa thông tin ứng viên.
     */
    Page<RecruiterApplicationDto> getJobApplications(String jobId, String recruiterId, Pageable pageable);

    /**
     * Kiểm tra xem user hiện tại đã nộp đơn vào job này chưa.
     * @param jobSeekerId ID của người tìm việc.
     * @param jobId ID của Job.
     * @return ApplicationCheckResponse (hasApplied, status, appliedAt).
     */
    ApplicationCheckResponse checkApplied(String jobSeekerId, String jobId);

    /**
     * Đếm số lượng ứng viên đã nộp đơn vào một Job.
     * @param jobId ID của Job.
     * @return ApplicationCountResponse chứa số lượng.
     */
    ApplicationCountResponse countApplicationsByJobId(String jobId);
}
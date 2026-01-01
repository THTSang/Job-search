package com.example.server.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.server.dto.ApplicationDtos.ApplicationResponse;
import com.example.server.dto.ApplicationDtos.ApplicationStats;
import com.example.server.dto.ApplicationDtos.ApplyRequest;
import com.example.server.dto.ApplicationDtos.UpdateApplicationStatusDto;

/**
 * Service Interface cho nghiệp vụ Ứng tuyển (Recruitment).
 * Định nghĩa các use-case theo Architecture.md.
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
}
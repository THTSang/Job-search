package com.example.server.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.example.server.dto.ApplicationDtos.ApplicationResponse;
import com.example.server.dto.ApplicationDtos.ApplicationStats;
import com.example.server.dto.ApplicationDtos.ApplyRequest;
import com.example.server.dto.ApplicationDtos.RecruiterApplicationDto;
import com.example.server.dto.ApplicationDtos.UpdateApplicationStatusDto;
import com.example.server.security.CustomUserDetails;
import com.example.server.service.ApplicationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controller quản lý quy trình Ứng tuyển (Recruitment).
 * Expose API theo api-spec.md.
 */
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    /**
     * Ứng viên nộp đơn vào một công việc.
     * POST /api/applications
     * 
     * @param userDetails Thông tin user từ Security Context.
     * @param request DTO chứa jobId và resumeUrl.
     */
    @PostMapping
    public ResponseEntity<ApplicationResponse> apply(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ApplyRequest request) {
        // Lấy ID người dùng từ CustomUserDetails
        String jobSeekerId = userDetails.getId();
        
        var response = applicationService.create(jobSeekerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Lấy lịch sử ứng tuyển của tôi (My Applications).
     * GET /api/applications/me
     */
    @GetMapping("/me")
    public ResponseEntity<Page<ApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 10, sort = "appliedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        String jobSeekerId = userDetails.getId();
        return ResponseEntity.ok(applicationService.getMyApplications(jobSeekerId, pageable));
    }

    /**
     * Lấy thống kê đơn ứng tuyển (Dashboard).
     * GET /api/applications/me/stats
     */
    @GetMapping("/me/stats")
    public ResponseEntity<ApplicationStats> getMyStats(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String jobSeekerId = userDetails.getId();
        return ResponseEntity.ok(applicationService.getMyStats(jobSeekerId));
    }

    /**
     * Nhà tuyển dụng cập nhật trạng thái đơn ứng tuyển.
     * PUT /api/applications/{id}/status
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateApplicationStatusDto dto) {
        // Recruiter ID lấy từ token để validate quyền sở hữu Job trong Service
        String recruiterId = userDetails.getId();
        var response = applicationService.updateStatus(id, recruiterId, dto);
        return ResponseEntity.ok(response);
    }

    /**
     * Nhà tuyển dụng xem danh sách ứng viên của một Job cụ thể.
     * GET /api/applications/job/{jobId}
     */
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Page<RecruiterApplicationDto>> getJobApplications(
            @PathVariable String jobId,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(size = 20, sort = "appliedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        String recruiterId = userDetails.getId();
        return ResponseEntity.ok(applicationService.getJobApplications(jobId, recruiterId, pageable));
    }
}
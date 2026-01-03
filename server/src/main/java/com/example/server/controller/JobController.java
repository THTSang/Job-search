package com.example.server.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dto.JobDtos.CreateJobDto;
import com.example.server.dto.JobDtos.JobDto;
import com.example.server.dto.JobDtos.JobSearchRequest;
import com.example.server.dto.JobDtos.UpdateJobDto;
import com.example.server.security.CustomUserDetails;
import com.example.server.service.JobService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controller quản lý các tin tuyển dụng (Jobs).
 * Expose API theo api-spec.md.
 */
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    // Inject Interface, không inject Implementation (JobServiceImpl) trực tiếp
    private final JobService jobService;

    /**
     * Tìm kiếm việc làm (Public Endpoint).
     * GET /api/jobs/search?keyword=Java&locationId=...
     * 
     * @param request Object chứa các tham số search (Spring tự map từ Query Params).
     * @param pageable Thông tin phân trang (Mặc định: page 0, size 10, sort createdAt desc).
     */
    @GetMapping("/search")
    public ResponseEntity<Page<JobDto>> searchJobs(
            JobSearchRequest request, 
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(jobService.searchJobs(request, pageable));
    }

    /**
     * Lấy chi tiết một công việc.
     * GET /api/jobs/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable String id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    /**
     * Đăng tin tuyển dụng mới (Recruiter).
     * POST /api/jobs
     */
    @PostMapping
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<JobDto> createJob(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateJobDto dto) {
        
        // Reconstruct DTO để đảm bảo postedByUserId là người đang login
        CreateJobDto secureDto = new CreateJobDto(
            dto.title(),
            dto.companyId(),
            dto.description(),
            dto.location(), // Truyền object CreateLocationDto
            dto.category(), // Truyền object CreateCategoryDto
            dto.employmentType(),
            dto.minExperience(),
            dto.salaryMin(),
            dto.salaryMax(),
            dto.deadline(),
            dto.tags(),
            userDetails.getId() // Force set userId from token
        );
        
        var createdJob = jobService.createJob(secureDto);
        // Trả về 201 Created
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    }

    /**
     * Cập nhật tin tuyển dụng.
     * PUT /api/jobs/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<JobDto> updateJob(
            @PathVariable String id,
            @Valid @RequestBody UpdateJobDto dto) {
        return ResponseEntity.ok(jobService.updateJob(id, dto));
    }

    /**
     * Xóa tin tuyển dụng.
     * DELETE /api/jobs/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteJob(@PathVariable String id) {
        jobService.deleteJob(id);
        // Trả về 204 No Content
        return ResponseEntity.noContent().build();
    }
}
package com.example.server.service;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dto.ApplicationDtos.ApplicationResponse;
import com.example.server.dto.ApplicationDtos.ApplicationStats;
import com.example.server.dto.ApplicationDtos.ApplyRequest;
import com.example.server.dto.ApplicationDtos.CompanySummary;
import com.example.server.dto.ApplicationDtos.JobSummary;
import com.example.server.dto.ApplicationDtos.UpdateApplicationStatusDto;
import com.example.server.exception.NotFoundException;
import com.example.server.model.Application;
import com.example.server.model.ApplicationStatus;
import com.example.server.model.Company;
import com.example.server.model.Job;
import com.example.server.model.JobStatus;
import com.example.server.repository.ApplicationRepository;
import com.example.server.repository.CompanyRepository;
import com.example.server.repository.JobRepository;

import lombok.RequiredArgsConstructor;

/**
 * Implementation của ApplicationService.
 * Tuân thủ quy tắc: Constructor Injection, Manual Mapping, Validation Logic.
 */
@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public ApplicationResponse create(String jobSeekerId, ApplyRequest request) {
        // 1. Validate Job Existence
        // Mentor Note: Cần check Job có tồn tại không trước khi nộp.
        var job = jobRepository.findById(request.jobId())
                .orElseThrow(() -> new NotFoundException("Job not found with id: " + request.jobId()));

        // 2. Validate Job Status (Business Rule)
        // Mentor Note: Chỉ cho phép nộp đơn vào Job đang OPEN.
        if (job.getStatus() != JobStatus.OPEN) {
            throw new IllegalArgumentException("Cannot apply to a job that is not OPEN (Current status: " + job.getStatus() + ")");
        }

        // 3. Check Duplicate Application
        // Mentor Note: Ngăn chặn spam nộp đơn nhiều lần vào cùng 1 job.
        if (applicationRepository.existsByJobSeekerIdAndJobId(jobSeekerId, request.jobId())) {
            throw new IllegalArgumentException("You have already applied for this job.");
        }

        // 4. Map DTO -> Entity (Builder Pattern)
        // Mentor Note: Sử dụng Builder Pattern để code gọn gàng và immutable khi khởi tạo.
        var now = Instant.now();
        var application = Application.builder()
                .jobId(request.jobId())
                .jobSeekerId(jobSeekerId)
                .resumeUrl(request.resumeUrl())
                // .coverLetter(request.coverLetter()) // Uncomment nếu Entity có field này
                .status(ApplicationStatus.PENDING)
                .appliedAt(now)
                .updatedAt(now)
                .build();

        // 5. Save to DB
        var savedApp = applicationRepository.save(application);

        // 6. Return Response
        return toDto(savedApp, job);
    }

    @Override
    public Page<ApplicationResponse> getMyApplications(String jobSeekerId, Pageable pageable) {
        // 1. Fetch Page of Applications
        Page<Application> appPage = applicationRepository.findAllByJobSeekerId(jobSeekerId, pageable);

        if (appPage.isEmpty()) {
            return Page.empty(pageable);
        }

        // 2. Optimization: Fetch related Jobs in Batch (Avoid N+1 Problem)
        // Mentor Note: Thay vì query Job cho từng Application, ta gom ID lại và query 1 lần.
        Set<String> jobIds = appPage.getContent().stream()
                .map(Application::getJobId)
                .collect(Collectors.toSet());

        Map<String, Job> jobMap = jobRepository.findAllById(jobIds).stream()
                .collect(Collectors.toMap(Job::getId, Function.identity()));

        // 3. Map Entity -> DTO
        return appPage.map(app -> {
            var job = jobMap.get(app.getJobId());
            return toDto(app, job);
        });
    }

    @Override
    public ApplicationStats getMyStats(String jobSeekerId) {
        long total = applicationRepository.countByJobSeekerId(jobSeekerId);
        long pending = applicationRepository.countByJobSeekerIdAndStatus(jobSeekerId, ApplicationStatus.PENDING);
        long interviewing = applicationRepository.countByJobSeekerIdAndStatus(jobSeekerId, ApplicationStatus.INTERVIEWING);
        long offered = applicationRepository.countByJobSeekerIdAndStatus(jobSeekerId, ApplicationStatus.OFFERED);

        return new ApplicationStats(total, pending, interviewing, offered);
    }

    @Override
    @Transactional
    public ApplicationResponse updateStatus(String applicationId, String recruiterId, UpdateApplicationStatusDto dto) {
        // 1. Tìm đơn ứng tuyển
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new NotFoundException("Application not found"));

        // 2. Tìm Job liên quan để kiểm tra quyền sở hữu
        Job job = jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new NotFoundException("Job not found"));

        // 3. SECURITY CHECK: Chỉ người đăng Job (Recruiter) mới được sửa trạng thái
        if (!job.getPostedByUserId().equals(recruiterId)) {
            // Ném lỗi 403 nếu Recruiter A cố sửa đơn của Recruiter B
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to update this application");
        }

        // 4. Cập nhật trạng thái
        application.setStatus(dto.status());
        application.setUpdatedAt(Instant.now());
        
        // (Optional) Nếu có field note trong Entity Application thì set vào đây
        // application.setNote(dto.note());

        Application savedApp = applicationRepository.save(application);

        // 5. Trả về DTO
        return toDto(savedApp, job); 
    }

    private ApplicationResponse toDto(Application app, Job job) {
        JobSummary jobSummary = (job != null) ? new JobSummary(job.getId(), job.getTitle()) : null;
        
        CompanySummary companySummary = null;
        if (job != null && job.getCompanyId() != null) {
            Company company = companyRepository.findById(job.getCompanyId()).orElse(null);
            if (company != null) {
                companySummary = new CompanySummary(company.getName(), company.getLogoUrl());
            }
        }

        return new ApplicationResponse(app.getId(), jobSummary, companySummary, app.getStatus(), app.getAppliedAt());
    }

    // Import các class cần thiết: JobRepository, ApplicationRepository, NotFoundException, AccessDeniedException
}
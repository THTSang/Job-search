package com.example.server.service;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.server.dto.JobDtos.CategoryDto;
import com.example.server.dto.JobDtos.CompanyDto;
import com.example.server.dto.JobDtos.CreateJobDto;
import com.example.server.dto.JobDtos.JobDto;
import com.example.server.dto.JobDtos.JobSearchRequest;
import com.example.server.dto.JobDtos.LocationDto;
import com.example.server.dto.JobDtos.UpdateJobDto;
import com.example.server.exception.NotFoundException; // Giả định class này đã tồn tại theo dev-workflow
import com.example.server.model.Category;
import com.example.server.model.Company;
import com.example.server.model.Job;
import com.example.server.model.JobStatus;
import com.example.server.model.Location;
import com.example.server.repository.CategoryRepository;
import com.example.server.repository.CompanyRepository;
import com.example.server.repository.JobRepository;
import com.example.server.repository.LocationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final LocationRepository locationRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Page<JobDto> searchJobs(JobSearchRequest request, Pageable pageable) {
        // 1. Gọi Repository để lấy Page<Entity>
        // Mentor Note: Chúng ta dùng Custom Repository để xử lý dynamic query phức tạp
        Page<Job> jobPage = jobRepository.searchJobs(request, pageable);

        // 2. Mapping từ Entity sang DTO
        // Mentor Note: Page.map() là method cực kỳ hữu ích, nó lazy-map từng phần tử
        // và giữ nguyên thông tin phân trang (totalElements, totalPages).
        return jobPage.map(this::toDto);
    }

    @Override
    public JobDto getJobById(String id) {
        return jobRepository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new NotFoundException("Job not found with id: " + id));
    }

    @Override
    public JobDto createJob(CreateJobDto dto) {
        // Mentor Note: Logic tạo mới thường bao gồm:
        // 1. Validate các ID tham chiếu (Company, Location...) có tồn tại không.
        // 2. Map dữ liệu từ DTO sang Entity.
        
        Job job = new Job();
        job.setTitle(dto.title());
        job.setDescription(dto.description());
        job.setEmploymentType(dto.employmentType());
        job.setMinExperience(dto.minExperience());
        job.setSalaryMin(dto.salaryMin());
        job.setSalaryMax(dto.salaryMax());
        job.setDeadline(dto.deadline());
        job.setTags(dto.tags());
        job.setPostedByUserId(dto.postedByUserId());
        
        // Set default values
        job.setStatus(JobStatus.OPEN);
        job.setCreatedAt(Instant.now());
        job.setUpdatedAt(Instant.now());

        // Fetch Relations
        Company company = companyRepository.findById(dto.companyId())
                .orElseThrow(() -> new NotFoundException("Company not found with id: " + dto.companyId()));
        job.setCompany(company);

        if (StringUtils.hasText(dto.locationId())) {
            Location location = locationRepository.findById(dto.locationId())
                    .orElseThrow(() -> new NotFoundException("Location not found with id: " + dto.locationId()));
            job.setLocation(location);
        }

        if (StringUtils.hasText(dto.categoryId())) {
            Category category = categoryRepository.findById(dto.categoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found with id: " + dto.categoryId()));
            job.setCategory(category);
        }
        
        Job savedJob = jobRepository.save(job);
        return toDto(savedJob);
    }

    @Override
    public JobDto updateJob(String id, UpdateJobDto dto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Job not found with id: " + id));

        // Partial Update Logic
        if (StringUtils.hasText(dto.title())) job.setTitle(dto.title());
        if (StringUtils.hasText(dto.description())) job.setDescription(dto.description());
        
        if (StringUtils.hasText(dto.locationId())) {
            Location location = locationRepository.findById(dto.locationId())
                    .orElseThrow(() -> new NotFoundException("Location not found with id: " + dto.locationId()));
            job.setLocation(location);
        }

        if (StringUtils.hasText(dto.categoryId())) {
            Category category = categoryRepository.findById(dto.categoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found with id: " + dto.categoryId()));
            job.setCategory(category);
        }

        if (dto.employmentType() != null) job.setEmploymentType(dto.employmentType());
        if (dto.minExperience() != null) job.setMinExperience(dto.minExperience());
        if (dto.salaryMin() != null) job.setSalaryMin(dto.salaryMin());
        if (dto.salaryMax() != null) job.setSalaryMax(dto.salaryMax());
        if (dto.status() != null) job.setStatus(dto.status());
        if (dto.deadline() != null) job.setDeadline(dto.deadline());
        if (dto.tags() != null) job.setTags(dto.tags());

        job.setUpdatedAt(Instant.now());
        return toDto(jobRepository.save(job));
    }

    @Override
    public void deleteJob(String id) {
        if (!jobRepository.existsById(id)) {
            throw new NotFoundException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }

    /**
     * Helper method: Chuyển đổi từ Job Entity sang JobDto.
     * Mentor Note: Chúng ta tách hàm này ra để tái sử dụng và giữ code clean.
     * Cần xử lý kỹ các trường hợp null của các object lồng nhau (Company, Location).
     */
    private JobDto toDto(Job job) {
        if (job == null) return null;

        // 1. Map Company (Nested DTO)
        CompanyDto companyDto = null;
        if (job.getCompany() != null) {
            companyDto = new CompanyDto(
                job.getCompany().getId(),
                job.getCompany().getName(),
                job.getCompany().getLogoUrl(),
                job.getCompany().getWebsite()
            );
        }

        // 2. Map Location (Nested DTO)
        LocationDto locationDto = null;
        if (job.getLocation() != null) {
            locationDto = new LocationDto(
                job.getLocation().getId(),
                job.getLocation().getCity(),
                job.getLocation().getAddress()
            );
        }

        // 3. Map Category (Nested DTO)
        CategoryDto categoryDto = null;
        if (job.getCategory() != null) {
            categoryDto = new CategoryDto(
                job.getCategory().getId(),
                job.getCategory().getName()
            );
        }

        // 4. Construct Main DTO
        return new JobDto(
            job.getId(),
            job.getTitle(),
            companyDto,
            job.getDescription(),
            locationDto,
            job.getEmploymentType(),
            job.getMinExperience(),
            job.getSalaryMin(),
            job.getSalaryMax(),
            categoryDto,
            job.getStatus(),
            job.getDeadline(),
            job.getTags(),
            job.getPostedByUserId(),
            job.getCreatedAt(),
            job.getUpdatedAt()
        );
    }
}
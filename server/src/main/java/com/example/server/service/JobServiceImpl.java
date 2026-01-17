package com.example.server.service;

import java.time.Instant;

import org.springframework.data.domain.Example;
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
import com.example.server.model.JobType;
import com.example.server.model.Location;
import com.example.server.repository.CategoryRepository;
import com.example.server.repository.ApplicationRepository;
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
    private final ApplicationRepository applicationRepository;

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
    public Page<JobDto> getJobsByCompanyId(String companyId, Pageable pageable) {
        return jobRepository.findByCompanyId(companyId, pageable).map(this::toDto);
    }

    @Override
    public JobDto createJob(CreateJobDto dto) {
        // Mentor Note: Logic tạo mới thường bao gồm:
        // 1. Validate Company tồn tại
        if (!companyRepository.existsById(dto.companyId())) {
            throw new NotFoundException("Company not found with id: " + dto.companyId());
        }
        
        // 2. Tạo và lưu Job (Parent Entity) trước để lấy ID
        Job job = Job.builder()
                .title(dto.title())
                .companyId(dto.companyId()) // Lưu ID thay vì Object
                .description(dto.description())
                .employmentType(dto.employmentType())
                .minExperience(dto.minExperience())
                .salaryMin(dto.salaryMin())
                .salaryMax(dto.salaryMax())
                .deadline(dto.deadline())
                .tags(dto.tags())
                .postedByUserId(dto.postedByUserId())
                .status(JobStatus.OPEN)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Job savedJob = jobRepository.save(job);

        // 3. Tạo và lưu Location (Weak Entity) - Composite
        Location location = Location.builder()
                .city(dto.location().city())
                .address(dto.location().address())
                .jobId(savedJob.getId()) // Link ngược về Job
                .build();
        locationRepository.save(location);

        // 4. Tạo và lưu Category (Weak Entity) - Optional
        if (dto.category() != null) {
            Category category = Category.builder()
                    .name(dto.category().name())
                    .jobId(savedJob.getId()) // Link ngược về Job
                    .build();
            categoryRepository.save(category);
        }
        
        return toDto(savedJob);
    }

    @Override
    public JobDto updateJob(String id, UpdateJobDto dto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Job not found with id: " + id));

        // Partial Update Logic
        if (StringUtils.hasText(dto.title())) job.setTitle(dto.title());
        if (StringUtils.hasText(dto.description())) job.setDescription(dto.description());
        
        // Update Location (Composite Update)
        if (dto.location() != null) {
            // Tìm Location thuộc về Job này (dùng Example để không phải sửa Repository Interface)
            Location location = locationRepository.findOne(Example.of(Location.builder().jobId(id).build()))
                    .orElseThrow(() -> new NotFoundException("Location not found for job: " + id));
            
            if (StringUtils.hasText(dto.location().city())) location.setCity(dto.location().city());
            if (StringUtils.hasText(dto.location().address())) location.setAddress(dto.location().address());
            locationRepository.save(location);
        }

        // Update Category (Composite Update)
        if (dto.category() != null) {
            Category category = categoryRepository.findOne(Example.of(Category.builder().jobId(id).build()))
                    .orElse(null);
            
            // Nếu chưa có category thì tạo mới, có rồi thì update
            if (category != null) {
                if (StringUtils.hasText(dto.category().name())) category.setName(dto.category().name());
                categoryRepository.save(category);
            } else {
                Category newCategory = Category.builder()
                        .name(dto.category().name())
                        .jobId(id)
                        .build();
                categoryRepository.save(newCategory);
            }
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
        
        // Cleanup Weak Entities (Orphan Removal)
        Location location = locationRepository.findOne(Example.of(Location.builder().jobId(id).build())).orElse(null);
        if (location != null) locationRepository.delete(location);

        Category category = categoryRepository.findOne(Example.of(Category.builder().jobId(id).build())).orElse(null);
        if (category != null) categoryRepository.delete(category);

        // Cleanup Applications (Cascading Delete)
        applicationRepository.deleteByJobId(id);

        jobRepository.deleteById(id);
    }

    /**
     * Helper method: Chuyển đổi từ Job Entity sang JobDto.
     * Mentor Note: Chúng ta tách hàm này ra để tái sử dụng và giữ code clean.
     * Cần xử lý kỹ các trường hợp null của các object lồng nhau (Company, Location).
     */
    private JobDto toDto(Job job) {
        if (job == null) return null;

        // 1. Fetch Company (Reference)
        // Vì Job chỉ lưu companyId, ta cần fetch Company để lấy thông tin hiển thị
        Company company = companyRepository.findById(job.getCompanyId()).orElse(null);
        CompanyDto companyDto = null;
        if (company != null) {
            companyDto = new CompanyDto(
                company.getId(),
                company.getName(),
                company.getLogoUrl(),
                company.getWebsite()
            );
        }

        // 2. Fetch Location (Weak Entity - by JobId)
        Location location = locationRepository.findOne(Example.of(Location.builder().jobId(job.getId()).build())).orElse(null);
        LocationDto locationDto = null;
        if (location != null) {
            locationDto = new LocationDto(
                location.getId(),
                location.getJobId(),
                location.getCity(),
                location.getAddress()
            );
        }

        // 3. Fetch Category (Weak Entity - by JobId)
        Category category = categoryRepository.findOne(Example.of(Category.builder().jobId(job.getId()).build())).orElse(null);
        CategoryDto categoryDto = null;
        if (category != null) {
            categoryDto = new CategoryDto(
                category.getId(),
                category.getJobId(),
                category.getName()
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
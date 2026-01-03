package com.example.server.dto;

import java.time.Instant;
import java.util.Set;

import com.example.server.model.JobStatus;
import com.example.server.model.JobType;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class JobDtos {

    // --- Company DTOs (Reference only) ---
    // Company có lifecycle riêng, Job chỉ tham chiếu hoặc hiển thị
    public record CompanyDto(
        String id,
        String name,
        String logoUrl,
        String website
    ) {}

    // --- Location DTOs (Weak Entity of Job) ---
    public record LocationDto(
        String id,
        String jobId,
        String city,
        String address
    ) {}

    public record CreateLocationDto(
        @NotBlank(message = "City is required") // Validate chặt chẽ khi tạo mới
        String city,
        @NotBlank(message = "Address is required")
        String address
    ) {}

    public record UpdateLocationDto(
        String city,
        String address
    ) {}

    // --- Category DTOs (Weak Entity of Job - MVP) ---
    public record CategoryDto(
        String id,
        String jobId,
        String name
    ) {}

    public record CreateCategoryDto(
        @NotBlank(message = "Category name is required")
        String name
    ) {}

    public record UpdateCategoryDto(
        String name
    ) {}

    // --- Search Request DTO ---
    public record JobSearchRequest(
        String keyword,
        String locationCity,   // Tìm theo tên thành phố thay vì ID
        String categoryName,   // Tìm theo tên ngành nghề thay vì ID
        Double minSalary,
        Double maxSalary,
        Integer minExperience,
        JobType jobType,
        JobStatus status
    ) {}

    // --- Main Job DTOs ---
    public record JobDto(
        String id,
        String title,
        CompanyDto company,       // Nested Object
        String description,
        LocationDto location,     // Nested Object
        JobType employmentType,
        Integer minExperience,
        Double salaryMin,
        Double salaryMax,
        CategoryDto category,     // Nested Object
        JobStatus status,
        Instant deadline,
        Set<String> tags,
        String postedByUserId,
        Instant createdAt,
        Instant updatedAt
    ) {}

    public record CreateJobDto(
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,

        @NotBlank(message = "Company ID is required")
        String companyId,

        @NotBlank(message = "Description is required")
        String description,

        @NotNull(message = "Location is required")
        CreateLocationDto location, // Composite: Tạo Location cùng lúc với Job

        CreateCategoryDto category, // Composite: Tạo Category cùng lúc với Job (Optional)

        @NotNull(message = "Employment type is required")
        JobType employmentType,

        @Min(value = 0, message = "Experience must be positive")
        Integer minExperience,

        @Min(value = 0, message = "Salary must be positive")
        Double salaryMin,

        @Min(value = 0, message = "Salary must be positive")
        Double salaryMax,

        @Future(message = "Deadline must be in the future")
        Instant deadline,

        Set<String> tags,
        String postedByUserId
    ) {}

    public record UpdateJobDto(
        String title,
        String description,
        UpdateLocationDto location, // Composite Update
        UpdateCategoryDto category, // Composite Update
        JobType employmentType,
        Integer minExperience,
        Double salaryMin,
        Double salaryMax,
        JobStatus status,
        Instant deadline,
        Set<String> tags
    ) {}
}
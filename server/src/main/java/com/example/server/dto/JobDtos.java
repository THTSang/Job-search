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

    // 1. Nested DTOs (Support for JobDto)
    public record CompanyDto(
        String id,
        String name,
        String logoUrl,
        String website
    ) {}

    public record CreateCompanyDto(
        @NotBlank(message = "Company name is required")
        String name,
        String logoUrl,
        String website,
        String description
    ) {}

    public record UpdateCompanyDto(
        String name,
        String logoUrl,
        String website,
        String description
    ) {}

    public record LocationDto(
        String id,
        String city,
        String address
    ) {}

    public record CreateLocationDto(
        @NotBlank(message = "City is required")
        String city,
        String address
    ) {}

    public record UpdateLocationDto(
        String city,
        String address
    ) {}

    public record CategoryDto(
        String id,
        String name
    ) {}

    public record CreateCategoryDto(@NotBlank String name) {}
    
    public record UpdateCategoryDto(String name) {}

    // 2. Main Response DTO
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

    // 3. Search Request DTO (Filter Criteria)
    public record JobSearchRequest(
        String keyword,        // Tìm theo title hoặc description
        String locationId,
        String categoryId,
        Double minSalary,      // Lọc các job có salaryMax >= minSalary
        Double maxSalary,      // Lọc các job có salaryMin <= maxSalary
        Integer minExperience, // Lọc các job yêu cầu kinh nghiệm <= minExperience
        JobType jobType,
        JobStatus status       // Thường mặc định là OPEN nếu không truyền
    ) {}

    // 4. Create Request DTO
    public record CreateJobDto(
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,

        @NotBlank(message = "Company ID is required")
        String companyId,

        @NotBlank(message = "Description is required")
        String description,

        String locationId,
        String categoryId,
        
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

    // 5. Update Request DTO
    public record UpdateJobDto(
        String title,
        String description,
        String locationId,
        String categoryId,
        JobType employmentType,
        Integer minExperience,
        Double salaryMin,
        Double salaryMax,
        JobStatus status,
        Instant deadline,
        Set<String> tags
    ) {}
}
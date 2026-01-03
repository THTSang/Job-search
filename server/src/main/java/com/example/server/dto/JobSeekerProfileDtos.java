package com.example.server.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.example.server.model.SkillCategory;

public class JobSeekerProfileDtos {

    // --- Experience DTOs ---
    public record ExperienceDto(
        String id,
        String profileId,
        String companyName,
        String position,
        LocalDate startDate,
        LocalDate endDate,
        Boolean isCurrent,
        String description
    ) {}

    public record CreateExperienceDto(
        @NotBlank(message = "Company name is required")
        String companyName,

        @NotBlank(message = "Position is required")
        String position,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        LocalDate endDate,
        Boolean isCurrent,
        String description
    ) {}

    public record UpdateExperienceDto(
        String companyName,
        String position,
        LocalDate startDate,
        LocalDate endDate,
        Boolean isCurrent,
        String description
    ) {}

    // --- Education DTOs ---
    public record EducationDto(
        String id,
        String profileId,
        String institution,
        String degree,
        String major,
        LocalDate startDate,
        LocalDate endDate,
        Double gpa
    ) {}

    public record CreateEducationDto(
        @NotBlank(message = "Institution is required")
        String institution,

        @NotBlank(message = "Degree is required")
        String degree,

        @NotBlank(message = "Major is required")
        String major,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        LocalDate endDate,
        Double gpa
    ) {}

    public record UpdateEducationDto(
        String institution,
        String degree,
        String major,
        LocalDate startDate,
        LocalDate endDate,
        Double gpa
    ) {}

    // --- Project DTOs ---
    public record ProjectDto(
        String id,
        String profileId,
        String projectName,
        String description,
        String role,
        Set<String> technologies,
        String projectUrl,
        Integer completionYear
    ) {}

    public record CreateProjectDto(
        @NotBlank(message = "Project name is required")
        String projectName,

        String description,
        String role,
        Set<String> technologies,
        String projectUrl,
        Integer completionYear
    ) {}

    public record UpdateProjectDto(
        String projectName,
        String description,
        String role,
        Set<String> technologies,
        String projectUrl,
        Integer completionYear
    ) {}

    // --- Skill DTOs (Moved from SkillDtos.java) ---
    public record SkillDto(
        String id,
        String name,
        SkillCategory category
    ) {}

    public record CreateSkillDto(
        @NotBlank(message = "Name is required")
        String name,
        @NotNull(message = "Category is required")
        SkillCategory category
    ) {}

    public record UpdateSkillDto(
        String name,
        SkillCategory category
    ) {}

    // --- Main Profile DTOs ---
    public record JobSeekerProfileDto(
        String id,
        String userId,
        String fullName,
        String professionalTitle,
        String phoneNumber,
        String address,
        String avatarUrl,
        String summary,

        // Nested DTOs for full profile view
        List<SkillDto> skills,
        List<ExperienceDto> experiences,
        List<EducationDto> educations,
        List<ProjectDto> projects,

        Instant createdAt,
        Instant updatedAt
    ) {}

    public record CreateJobSeekerProfileDto(
        @NotBlank(message = "Full name is required")
        String fullName,

        String professionalTitle,
        String phoneNumber,
        String address,
        String avatarUrl,
        String summary,

        List<CreateSkillDto> skills, // Changed from skillIds to full objects
        List<CreateExperienceDto> experiences, // DTO để tạo mới
        List<CreateEducationDto> educations,
        List<CreateProjectDto> projects
    ) {}

    public record UpdateJobSeekerProfileDto(
        String fullName,
        String professionalTitle,
        String phoneNumber,
        String address,
        String avatarUrl,
        String summary,
        
        List<UpdateSkillDto> skills, // Changed from skillIds to full objects
        List<UpdateExperienceDto> experiences,
        List<UpdateEducationDto> educations,
        List<UpdateProjectDto> projects
    ) {}
}
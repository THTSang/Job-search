package com.example.server.dto;

import java.time.Instant;
import java.util.List;
import java.util.Set;

import jakarta.validation.constraints.NotBlank;

public class JobSeekerProfileDtos {
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
        Set<SkillDtos.SkillDto> skills,
        List<ExperienceDtos.ExperienceDto> experiences,
        List<EducationDtos.EducationDto> educations,
        List<ProjectDtos.ProjectDto> projects,

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

        Set<String> skillIds,
        List<ExperienceDtos.CreateExperienceDto> experiences, // DTO để tạo mới
        List<EducationDtos.CreateEducationDto> educations,
        List<ProjectDtos.CreateProjectDto> projects
    ) {}

    public record UpdateJobSeekerProfileDto(
        String fullName,
        String professionalTitle,
        String phoneNumber,
        String address,
        String avatarUrl,
        String summary,
        
        Set<String> skillIds,
        List<ExperienceDtos.UpdateExperienceDto> experiences,
        List<EducationDtos.UpdateEducationDto> educations,
        List<ProjectDtos.UpdateProjectDto> projects
    ) {}
}
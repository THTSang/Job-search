package com.example.server.dto;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;

public class ProjectDtos {
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
}
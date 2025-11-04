package com.example.server.dto;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class JobDtos {
    public record JobDto(String id, String title, String company, String description, String location,
                         String employmentType, Set<String> tags, String postedByUserId) {}

    public record CreateJobDto(
            @NotBlank @Size(min = 3, max = 100) String title,
            @NotBlank String company,
            @NotBlank String description,
            String location,
            String employmentType,
            Set<String> tags,
            String postedByUserId
    ) {}

    public record UpdateJobDto(
            String title,
            String company,
            String description,
            String location,
            String employmentType,
            Set<String> tags
    ) {}
}

package com.example.server.dto;

import com.example.server.model.SkillCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SkillDtos {
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
}
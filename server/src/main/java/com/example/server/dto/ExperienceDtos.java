package com.example.server.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ExperienceDtos {
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
}
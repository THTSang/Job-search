package com.example.server.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EducationDtos {
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
}
package com.example.server.dto;

public class GeneralDtos {
    public record SystemStatsResponse(
        long userCount,
        long jobCount,
        long companyCount
    ) {}
}
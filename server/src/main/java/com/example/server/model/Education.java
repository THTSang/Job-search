package com.example.server.model;

import java.time.Instant;
import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Document(collection = "educations")
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class Education {
    @Id
    private String id;

    @Indexed
    private String profileId; // Foreign Key to JobSeekerProfile

    private String institution;
    private String degree;
    private String major;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double gpa;

    private Instant createdAt;
    private Instant updatedAt;
}
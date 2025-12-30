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
@Document(collection = "experiences")
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class Experience {
    @Id
    private String id;

    @Indexed
    private String profileId; // Foreign Key to JobSeekerProfile

    private String companyName;
    private String position;
    private LocalDate startDate;
    private LocalDate endDate; // Null if isCurrent is true
    private Boolean isCurrent;
    private String description;

    private Instant createdAt;
    private Instant updatedAt;
}
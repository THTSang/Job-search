package com.example.server.model;

import java.time.Instant;
import java.util.Set;

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
@Document(collection = "projects")
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    private String id;

    @Indexed
    private String profileId; // Foreign Key to JobSeekerProfile

    private String projectName;
    private String description;
    private String role;
    private Set<String> technologies;
    private String projectUrl;
    private Integer completionYear;

    private Instant createdAt;
    private Instant updatedAt;
}
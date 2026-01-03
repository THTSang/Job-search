package com.example.server.model;

import java.time.Instant;

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
@Document(collection = "skills")
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class Skill {
    @Id
    private String id;

    @Indexed
    private String profileId; // Foreign Key to JobSeekerProfile

    @Indexed
    private String name;
    private SkillCategory category;

    private Instant createdAt;
    private Instant updatedAt;
}
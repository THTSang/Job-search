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
@Document(collection = "job_seeker_profiles")
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerProfile {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId; // Foreign Key 1:1 with User

    private String fullName;
    private String professionalTitle;
    private String phoneNumber;
    private String address;
    private String avatarUrl;
    private String summary;

    private Instant createdAt;
    private Instant updatedAt;
}
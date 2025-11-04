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
@Document(collection = "jobs")
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    private String id;

    @Indexed
    private String title;
    private String company;
    private String description;
    private String location;
    private String employmentType; // full-time, part-time, contract
    private Set<String> tags;
    private String postedByUserId;

    private Instant createdAt;
    private Instant updatedAt;
}

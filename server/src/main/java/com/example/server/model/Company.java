package com.example.server.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "companies")
public class Company {
    @Id
    private String id;

    private String name;
    private String industry;
    private String scale;
    private String address;
    private String logoUrl;
    private String contactEmail;
    private String phone;
    private String website;
    private String description;

    @Indexed
    private String recruiterId;

    @Builder.Default
    private Boolean isVerified = false;

    private Instant createdAt;
    private Instant updatedAt;
}
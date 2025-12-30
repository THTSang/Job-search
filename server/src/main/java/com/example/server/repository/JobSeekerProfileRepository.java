package com.example.server.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.JobSeekerProfile;

@Repository
public interface JobSeekerProfileRepository extends MongoRepository<JobSeekerProfile, String> {
    Optional<JobSeekerProfile> findByUserId(String userId);
}
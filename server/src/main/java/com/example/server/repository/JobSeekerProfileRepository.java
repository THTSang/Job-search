package com.example.server.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.JobSeekerProfile;

// Mentor Note: Kế thừa thêm JobSeekerProfileRepositoryCustom để tích hợp các method custom.
@Repository
public interface JobSeekerProfileRepository extends MongoRepository<JobSeekerProfile, String>, JobSeekerProfileRepositoryCustom {
    Optional<JobSeekerProfile> findByUserId(String userId);
    List<JobSeekerProfile> findByUserIdIn(Collection<String> userIds);
}
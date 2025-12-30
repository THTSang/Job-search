package com.example.server.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Education;

@Repository
public interface EducationRepository extends MongoRepository<Education, String> {
    List<Education> findByProfileId(String profileId);
}
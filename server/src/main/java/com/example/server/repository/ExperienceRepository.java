package com.example.server.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Experience;

@Repository
public interface ExperienceRepository extends MongoRepository<Experience, String> {
    List<Experience> findByProfileId(String profileId);
}
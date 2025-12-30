package com.example.server.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Project;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByProfileId(String profileId);
}
package com.example.server.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Job;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByTitleContainingIgnoreCase(String title);
    List<Job> findByCompanyContainingIgnoreCase(String company);
}
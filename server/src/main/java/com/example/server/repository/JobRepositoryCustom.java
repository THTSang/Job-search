package com.example.server.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.server.dto.JobDtos.JobSearchRequest;
import com.example.server.model.Job;

public interface JobRepositoryCustom {
    Page<Job> searchJobs(JobSearchRequest request, Pageable pageable);
}
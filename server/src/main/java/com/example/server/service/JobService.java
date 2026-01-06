package com.example.server.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.server.dto.JobDtos.CreateJobDto;
import com.example.server.dto.JobDtos.JobDto;
import com.example.server.dto.JobDtos.JobSearchRequest;
import com.example.server.dto.JobDtos.UpdateJobDto;

public interface JobService {
    Page<JobDto> searchJobs(JobSearchRequest request, Pageable pageable);
    JobDto getJobById(String id);
    JobDto createJob(CreateJobDto createDto);
    JobDto updateJob(String id, UpdateJobDto updateDto);
    void deleteJob(String id);
    Page<JobDto> getJobsByCompanyId(String companyId, Pageable pageable);
}
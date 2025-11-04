package com.example.server.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.server.dto.JobDtos;
import com.example.server.exception.NotFoundException;
import com.example.server.model.Job;
import com.example.server.repository.JobRepository;
import com.mongodb.lang.NonNull;

@Service
public class JobService {
    private final JobRepository repository;

    public JobService(JobRepository repository) {
        this.repository = repository;
    }

    public List<Job> list(String q) {
        if (StringUtils.hasText(q)) {
            return repository.findByTitleContainingIgnoreCase(q);
        }
        return repository.findAll();
    }

    public Job get(@NonNull String id) {
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Job not found"));
    }

    public Job create(JobDtos.CreateJobDto dto) {
        Job j = new Job();
        j.setTitle(dto.title());
        j.setCompany(dto.company());
        j.setDescription(dto.description());
        j.setLocation(dto.location());
        j.setEmploymentType(dto.employmentType());
        j.setTags(dto.tags());
        j.setPostedByUserId(dto.postedByUserId());
        j.setCreatedAt(Instant.now());
        j.setUpdatedAt(Instant.now());
        return repository.save(j);
    }

    public Job update(String id, JobDtos.UpdateJobDto dto) {
        Job j = get(id);
        if (StringUtils.hasText(dto.title())) j.setTitle(dto.title());
        if (StringUtils.hasText(dto.company())) j.setCompany(dto.company());
        if (StringUtils.hasText(dto.description())) j.setDescription(dto.description());
        if (dto.location() != null) j.setLocation(dto.location());
        if (dto.employmentType() != null) j.setEmploymentType(dto.employmentType());
        if (dto.tags() != null) j.setTags(dto.tags());
        j.setUpdatedAt(Instant.now());
        return repository.save(j);
    }

    public void delete(@NonNull String id) {
        if (!repository.existsById(id)) throw new NotFoundException("Job not found");
        repository.deleteById(id);
    }
}
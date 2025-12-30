package com.example.server.controller;

import com.example.server.model.Job;
import com.example.server.dto.JobDtos;
import com.example.server.service.JobService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    private final JobService service;

    public JobController(JobService service) {
        this.service = service;
    }

    @GetMapping
    public Page<JobDtos.JobDto> list(@RequestParam(name = "q", required = false) String q, Pageable pageable) {
        return service.list(q, pageable).map(this::toDto);
    }

    @GetMapping("/{id}")
    public JobDtos.JobDto get(@PathVariable String id) {
        return toDto(service.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobDtos.JobDto create(@Valid @RequestBody JobDtos.CreateJobDto dto) {
        Job created = service.create(dto);
        return toDto(created);
    }

    @PutMapping("/{id}")
    public JobDtos.JobDto update(@PathVariable String id, @Valid @RequestBody JobDtos.UpdateJobDto dto) {
        return toDto(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    private JobDtos.JobDto toDto(Job j) {
        return new JobDtos.JobDto(
                j.getId(), j.getTitle(), j.getCompany(), j.getDescription(),
                j.getLocation(), j.getEmploymentType(), j.getExperience(), j.getSalary(), j.getTags(), j.getPostedByUserId()
        );
    }
}
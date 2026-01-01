package com.example.server.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.server.dto.JobSeekerProfileDtos;
import com.example.server.dto.JobSeekerProfileDtos.CreateJobSeekerProfileDto;
import com.example.server.dto.JobSeekerProfileDtos.JobSeekerProfileDto;
import com.example.server.dto.JobSeekerProfileDtos.UpdateJobSeekerProfileDto;

public interface JobSeekerProfileService {
    Page<JobSeekerProfileDto> getAllProfiles(Pageable pageable);
    JobSeekerProfileDto getProfileByUserId(String userId);
    JobSeekerProfileDto createProfile(String userId, CreateJobSeekerProfileDto dto);
    JobSeekerProfileDto updateProfile(String userId, UpdateJobSeekerProfileDto dto);
}
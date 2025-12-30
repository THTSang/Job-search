package com.example.server.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dto.JobSeekerProfileDtos.CreateJobSeekerProfileDto;
import com.example.server.dto.JobSeekerProfileDtos.JobSeekerProfileDto;
import com.example.server.dto.JobSeekerProfileDtos.UpdateJobSeekerProfileDto;
import com.example.server.service.JobSeekerProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class JobSeekerProfileController {

    private final JobSeekerProfileService profileService;

    @GetMapping
    public Page<JobSeekerProfileDto> list(Pageable pageable) {
        return profileService.getAllProfiles(pageable);
    }

    @GetMapping("/me")
    public JobSeekerProfileDto getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        return profileService.getProfileByUserId(jwt.getSubject());
    }

    @PostMapping("/me")
    @ResponseStatus(HttpStatus.CREATED)
    public JobSeekerProfileDto createMyProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateJobSeekerProfileDto dto) {
        return profileService.createProfile(jwt.getSubject(), dto);
    }

    @PutMapping("/me")
    public JobSeekerProfileDto updateMyProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateJobSeekerProfileDto dto) {
        return profileService.updateProfile(jwt.getSubject(), dto);
    }
}
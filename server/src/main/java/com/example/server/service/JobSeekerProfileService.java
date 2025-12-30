package com.example.server.service;

import java.time.Instant;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.server.dto.EducationDtos;
import com.example.server.dto.ExperienceDtos;
import com.example.server.dto.JobSeekerProfileDtos;
import com.example.server.dto.ProjectDtos;
import com.example.server.dto.SkillDtos;
import com.example.server.exception.NotFoundException;
import com.example.server.model.Education;
import com.example.server.model.Experience;
import com.example.server.model.JobSeekerProfile;
import com.example.server.model.Project;
import com.example.server.repository.EducationRepository;
import com.example.server.repository.ExperienceRepository;
import com.example.server.repository.JobSeekerProfileRepository;
import com.example.server.repository.ProjectRepository;
import com.example.server.repository.SkillRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobSeekerProfileService {

    private final JobSeekerProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final ProjectRepository projectRepository;

    public Page<JobSeekerProfileDtos.JobSeekerProfileDto> getAllProfiles(Pageable pageable) {
        return profileRepository.findAll(pageable)
                .map(this::toDto);
    }

    public JobSeekerProfileDtos.JobSeekerProfileDto getProfileByUserId(String userId) {
        var profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Profile not found for user: " + userId));
        return toDto(profile);
    }

    public JobSeekerProfileDtos.JobSeekerProfileDto createProfile(String userId, JobSeekerProfileDtos.CreateJobSeekerProfileDto dto) {
        if (profileRepository.findByUserId(userId).isPresent()) {
            throw new IllegalArgumentException("Profile already exists for user: " + userId);
        }

        var profile = JobSeekerProfile.builder()
                .userId(userId)
                .fullName(dto.fullName())
                .professionalTitle(dto.professionalTitle())
                .phoneNumber(dto.phoneNumber())
                .address(dto.address())
                .avatarUrl(dto.avatarUrl())
                .summary(dto.summary())
                .skillIds(dto.skillIds())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        var savedProfile = profileRepository.save(profile);

        // Create sub-entities
        if (dto.experiences() != null) {
            var experiences = dto.experiences().stream()
                    .map(e -> mapToExperience(e, savedProfile.getId()))
                    .toList();
            experienceRepository.saveAll(experiences);
        }

        if (dto.educations() != null) {
            var educations = dto.educations().stream()
                    .map(e -> mapToEducation(e, savedProfile.getId()))
                    .toList();
            educationRepository.saveAll(educations);
        }

        if (dto.projects() != null) {
            var projects = dto.projects().stream()
                    .map(p -> mapToProject(p, savedProfile.getId()))
                    .toList();
            projectRepository.saveAll(projects);
        }

        return toDto(savedProfile);
    }

    public JobSeekerProfileDtos.JobSeekerProfileDto updateProfile(String userId, JobSeekerProfileDtos.UpdateJobSeekerProfileDto dto) {
        var profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Profile not found for user: " + userId));

        if (StringUtils.hasText(dto.fullName())) profile.setFullName(dto.fullName());
        if (StringUtils.hasText(dto.professionalTitle())) profile.setProfessionalTitle(dto.professionalTitle());
        if (StringUtils.hasText(dto.phoneNumber())) profile.setPhoneNumber(dto.phoneNumber());
        if (StringUtils.hasText(dto.address())) profile.setAddress(dto.address());
        if (StringUtils.hasText(dto.avatarUrl())) profile.setAvatarUrl(dto.avatarUrl());
        if (StringUtils.hasText(dto.summary())) profile.setSummary(dto.summary());
        if (dto.skillIds() != null) profile.setSkillIds(dto.skillIds());

        profile.setUpdatedAt(Instant.now());
        var savedProfile = profileRepository.save(profile);

        // Handle sub-entities: Strategy - Replace All if provided
        if (dto.experiences() != null) {
            var oldExps = experienceRepository.findByProfileId(savedProfile.getId());
            experienceRepository.deleteAll(oldExps);
            
            var newExps = dto.experiences().stream()
                    .map(e -> mapToExperience(e, savedProfile.getId()))
                    .toList();
            experienceRepository.saveAll(newExps);
        }

        if (dto.educations() != null) {
            var oldEdus = educationRepository.findByProfileId(savedProfile.getId());
            educationRepository.deleteAll(oldEdus);

            var newEdus = dto.educations().stream()
                    .map(e -> mapToEducation(e, savedProfile.getId()))
                    .toList();
            educationRepository.saveAll(newEdus);
        }

        if (dto.projects() != null) {
            var oldProjs = projectRepository.findByProfileId(savedProfile.getId());
            projectRepository.deleteAll(oldProjs);

            var newProjs = dto.projects().stream()
                    .map(p -> mapToProject(p, savedProfile.getId()))
                    .toList();
            projectRepository.saveAll(newProjs);
        }

        return toDto(savedProfile);
    }

    private JobSeekerProfileDtos.JobSeekerProfileDto toDto(JobSeekerProfile profile) {
        // Fetch Skills
        Set<SkillDtos.SkillDto> skills = Collections.emptySet();
        if (profile.getSkillIds() != null && !profile.getSkillIds().isEmpty()) {
            skills = skillRepository.findAllById(profile.getSkillIds()).stream()
                    .map(s -> new SkillDtos.SkillDto(s.getId(), s.getName(), s.getCategory()))
                    .collect(Collectors.toSet());
        }

        // Fetch Sub-entities
        var experiences = experienceRepository.findByProfileId(profile.getId()).stream()
                .map(e -> new ExperienceDtos.ExperienceDto(
                        e.getId(), e.getProfileId(), e.getCompanyName(), e.getPosition(),
                        e.getStartDate(), e.getEndDate(), e.getIsCurrent(), e.getDescription()))
                .toList();

        var educations = educationRepository.findByProfileId(profile.getId()).stream()
                .map(e -> new EducationDtos.EducationDto(
                        e.getId(), e.getProfileId(), e.getInstitution(), e.getDegree(),
                        e.getMajor(), e.getStartDate(), e.getEndDate(), e.getGpa()))
                .toList();

        var projects = projectRepository.findByProfileId(profile.getId()).stream()
                .map(p -> new ProjectDtos.ProjectDto(
                        p.getId(), p.getProfileId(), p.getProjectName(), p.getDescription(),
                        p.getRole(), p.getTechnologies(), p.getProjectUrl(), p.getCompletionYear()))
                .toList();

        return new JobSeekerProfileDtos.JobSeekerProfileDto(
                profile.getId(),
                profile.getUserId(),
                profile.getFullName(),
                profile.getProfessionalTitle(),
                profile.getPhoneNumber(),
                profile.getAddress(),
                profile.getAvatarUrl(),
                profile.getSummary(),
                skills,
                experiences,
                educations,
                projects,
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }

    // --- Mappers for Sub-entities (Create & Update) ---

    private Experience mapToExperience(ExperienceDtos.CreateExperienceDto dto, String profileId) {
        return Experience.builder().profileId(profileId).companyName(dto.companyName()).position(dto.position()).startDate(dto.startDate()).endDate(dto.endDate()).isCurrent(dto.isCurrent()).description(dto.description()).createdAt(Instant.now()).updatedAt(Instant.now()).build();
    }
    private Experience mapToExperience(ExperienceDtos.UpdateExperienceDto dto, String profileId) {
        return Experience.builder().profileId(profileId).companyName(dto.companyName()).position(dto.position()).startDate(dto.startDate()).endDate(dto.endDate()).isCurrent(dto.isCurrent()).description(dto.description()).createdAt(Instant.now()).updatedAt(Instant.now()).build();
    }

    private Education mapToEducation(EducationDtos.CreateEducationDto dto, String profileId) {
        return Education.builder().profileId(profileId).institution(dto.institution()).degree(dto.degree()).major(dto.major()).startDate(dto.startDate()).endDate(dto.endDate()).gpa(dto.gpa()).createdAt(Instant.now()).updatedAt(Instant.now()).build();
    }
    private Education mapToEducation(EducationDtos.UpdateEducationDto dto, String profileId) {
        return Education.builder().profileId(profileId).institution(dto.institution()).degree(dto.degree()).major(dto.major()).startDate(dto.startDate()).endDate(dto.endDate()).gpa(dto.gpa()).createdAt(Instant.now()).updatedAt(Instant.now()).build();
    }

    private Project mapToProject(ProjectDtos.CreateProjectDto dto, String profileId) {
        return Project.builder().profileId(profileId).projectName(dto.projectName()).description(dto.description()).role(dto.role()).technologies(dto.technologies()).projectUrl(dto.projectUrl()).completionYear(dto.completionYear()).createdAt(Instant.now()).updatedAt(Instant.now()).build();
    }
    private Project mapToProject(ProjectDtos.UpdateProjectDto dto, String profileId) {
        return Project.builder().profileId(profileId).projectName(dto.projectName()).description(dto.description()).role(dto.role()).technologies(dto.technologies()).projectUrl(dto.projectUrl()).completionYear(dto.completionYear()).createdAt(Instant.now()).updatedAt(Instant.now()).build();
    }
}
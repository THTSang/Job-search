package com.example.server.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dto.JobSeekerProfileDtos.CreateJobSeekerProfileDto;
import com.example.server.dto.JobSeekerProfileDtos.JobSeekerProfileDto;
import com.example.server.dto.JobSeekerProfileDtos.UpdateJobSeekerProfileDto;
import com.example.server.security.CustomUserDetails;
import com.example.server.service.JobSeekerProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class JobSeekerProfileController {

    // Mentor Note: Spring sẽ tự động inject implementation (JobSeekerProfileServiceImpl)
    // vào interface này nhờ annotation @Service ở class Impl.
    private final JobSeekerProfileService profileService;

    @GetMapping
    @PreAuthorize("hasRole('RECRUITER') or hasRole('ADMIN')")
    public ResponseEntity<Page<JobSeekerProfileDto>> list(
            // Mentor Note: Thiết lập mặc định size=10 và sort theo ngày tạo mới nhất nếu client không gửi
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(profileService.getAllProfiles(pageable));
    }

    /**
     * Lấy hồ sơ của chính người dùng đang đăng nhập.
     * @param userDetails: Được inject từ Security Context (Token).
     */
    @GetMapping("/me")
    public ResponseEntity<JobSeekerProfileDto> getMyProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(profileService.getProfileByUserId(userDetails.getId()));
    }

    /**
     * Tạo mới hồ sơ (Composite Create).
     * Nhận vào DTO chứa cả thông tin cơ bản + list skills (DTOs) + list experiences/educations/projects.
     */
    @PostMapping("/me")
    public ResponseEntity<JobSeekerProfileDto> createMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateJobSeekerProfileDto dto) {
        
        // Mentor Note: Sử dụng ResponseEntity để trả về 201 Created rõ ràng
        JobSeekerProfileDto createdProfile = profileService.createProfile(userDetails.getId(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProfile);
    }

    /**
     * Cập nhật hồ sơ (Composite Update).
     * Nếu gửi list con (vd: experiences) thì sẽ thay thế toàn bộ list cũ bằng list mới (Replace Strategy).
     */
    @PutMapping("/me")
    public ResponseEntity<JobSeekerProfileDto> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UpdateJobSeekerProfileDto dto) {
        return ResponseEntity.ok(profileService.updateProfile(userDetails.getId(), dto));
    }
}
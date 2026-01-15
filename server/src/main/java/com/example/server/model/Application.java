package com.example.server.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Document(collection = "applications")
// Mentor Note: Giúp API response gọn gàng, không trả về các trường null
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    @Id
    private String id;

    // Mentor Note: Đánh index để tìm nhanh danh sách đơn ứng tuyển của một Job cụ thể
    @Indexed
    private String jobId;

    // Mentor Note: Đánh index để tìm nhanh lịch sử ứng tuyển của một ứng viên (My Applications)
    @Indexed
    private String jobSeekerId;

    private String resumeUrl;
    
    private String coverLetter;

    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    private Instant appliedAt;
    
    private Instant updatedAt;
}
package com.example.server.model;

import java.time.Instant;
import java.util.Set;

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
@Document(collection = "jobs")
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    private String id;

    @Indexed
    private String title;

    @Indexed
    private String companyId; // Tham chiếu đến Company đã tạo

    private String description;

    // Ensure JobType is accessible or imported if it's in a different package, though usually same package is fine.
    private JobType employmentType;

    private Integer minExperience; // Số năm kinh nghiệm (để lọc)

    private Double salaryMin;      // Mức lương thấp nhất (để lọc)
    private Double salaryMax;      // Mức lương cao nhất (để lọc)

    @Indexed
    private JobStatus status;      // Trạng thái tin tuyển dụng

    private Instant deadline;      // Hạn nộp hồ sơ

    private Set<String> tags;
    private String postedByUserId;

    private Instant createdAt;
    private Instant updatedAt;
}

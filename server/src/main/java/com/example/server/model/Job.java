package com.example.server.model;

import java.time.Instant;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

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

    @DBRef
    private Company company;

    private String description;

    @DBRef
    private Location location;

    private JobType employmentType;

    private Integer minExperience; // Số năm kinh nghiệm (để lọc)

    private Double salaryMin;      // Mức lương thấp nhất (để lọc)
    private Double salaryMax;      // Mức lương cao nhất (để lọc)

    @DBRef
    private Category category;     // Ngành nghề/Lĩnh vực

    @Indexed
    private JobStatus status;      // Trạng thái tin tuyển dụng

    private Instant deadline;      // Hạn nộp hồ sơ

    private Set<String> tags;
    private String postedByUserId;

    private Instant createdAt;
    private Instant updatedAt;
}

package com.example.server.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.util.StringUtils;

import com.example.server.dto.JobDtos.JobSearchRequest;
import com.example.server.model.Job;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JobRepositoryCustomImpl implements JobRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public Page<Job> searchJobs(JobSearchRequest request, Pageable pageable) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        // 1. Text Search (Keyword) trên Title hoặc Description
        if (StringUtils.hasText(request.keyword())) {
            String regex = ".*" + request.keyword() + ".*"; // Simple contains logic
            criteriaList.add(new Criteria().orOperator(
                Criteria.where("title").regex(request.keyword(), "i"), // "i" for case-insensitive
                Criteria.where("description").regex(request.keyword(), "i")
            ));
        }

        // 2. Filter by References (Location, Category) - Querying DBRef ID
        if (StringUtils.hasText(request.locationId())) {
            criteriaList.add(Criteria.where("location.id").is(request.locationId()));
        }

        if (StringUtils.hasText(request.categoryId())) {
            criteriaList.add(Criteria.where("category.id").is(request.categoryId()));
        }

        // 3. Filter by Enum (JobType, Status)
        if (request.jobType() != null) {
            criteriaList.add(Criteria.where("employmentType").is(request.jobType()));
        }

        if (request.status() != null) {
            criteriaList.add(Criteria.where("status").is(request.status()));
        }

        // 4. Filter by Range (Salary, Experience)
        // Logic: Tìm job có salaryMax >= minSalary mong muốn
        if (request.minSalary() != null) {
            criteriaList.add(Criteria.where("salaryMax").gte(request.minSalary()));
        }

        // Logic: Tìm job có salaryMin <= maxSalary mong muốn
        if (request.maxSalary() != null) {
            criteriaList.add(Criteria.where("salaryMin").lte(request.maxSalary()));
        }

        // Logic: Tìm job yêu cầu kinh nghiệm <= kinh nghiệm của ứng viên
        if (request.minExperience() != null) {
            criteriaList.add(Criteria.where("minExperience").lte(request.minExperience()));
        }

        // Combine all criteria
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList));
        }

        // Pagination
        long total = mongoTemplate.count(query, Job.class);
        query.with(pageable);
        List<Job> jobs = mongoTemplate.find(query, Job.class);

        return new PageImpl<>(jobs, pageable, total);
    }
}
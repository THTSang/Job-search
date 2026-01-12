package com.example.server.repository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConvertOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.util.StringUtils;
import org.bson.Document;

import com.example.server.dto.JobDtos.JobSearchRequest;
import com.example.server.model.Job;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JobRepositoryCustomImpl implements JobRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public Page<Job> searchJobs(JobSearchRequest request, Pageable pageable) {
        List<AggregationOperation> operations = new ArrayList<>();

        // 1. Convert _id (ObjectId) to String để join với jobId (String) trong Location/Category
        // Mentor Note: Fix lỗi Lookup không khớp do lệch kiểu dữ liệu (ObjectId vs String)
        operations.add(Aggregation.addFields()
            .addField("jobIdStr").withValue(ConvertOperators.ToString.toString("$_id"))
            .build());

        // 2. Lookup Relations (Left Outer Join) sử dụng jobIdStr
        // "locations" và "categories" là tên collection trong MongoDB
        operations.add(Aggregation.lookup("locations", "jobIdStr", "jobId", "locationInfo"));
        operations.add(Aggregation.lookup("categories", "jobIdStr", "jobId", "categoryInfo"));

        // 3. Build Criteria
        List<Criteria> criteriaList = new ArrayList<>();

        // Keyword Search (Title or Description)
        if (StringUtils.hasText(request.keyword())) {
            criteriaList.add(new Criteria().orOperator(
                Criteria.where("title").regex(request.keyword(), "i"), // "i" for case-insensitive
                Criteria.where("description").regex(request.keyword(), "i")
            ));
        }

        // Filter by Location City (via Lookup result 'locationInfo')
        if (StringUtils.hasText(request.locationCity())) {
            criteriaList.add(Criteria.where("locationInfo").elemMatch(
                Criteria.where("city").regex(request.locationCity(), "i")
            ));
        }

        // Filter by Category Name (via Lookup result 'categoryInfo')
        if (StringUtils.hasText(request.categoryName())) {
            criteriaList.add(Criteria.where("categoryInfo").elemMatch(
                Criteria.where("name").regex(request.categoryName(), "i")
            ));
        }

        // Native Job Filters
        if (request.jobType() != null) {
            criteriaList.add(Criteria.where("employmentType").is(request.jobType()));
        }
        if (request.status() != null) {
            criteriaList.add(Criteria.where("status").is(request.status()));
        }
        if (request.minSalary() != null) {
            criteriaList.add(Criteria.where("salaryMax").gte(request.minSalary()));
        }
        if (request.maxSalary() != null) {
            criteriaList.add(Criteria.where("salaryMin").lte(request.maxSalary()));
        }
        if (request.minExperience() != null) {
            criteriaList.add(Criteria.where("minExperience").lte(request.minExperience()));
        }

        // Apply Match
        if (!criteriaList.isEmpty()) {
            operations.add(Aggregation.match(new Criteria().andOperator(criteriaList)));
        }

        // 3. Pagination Support (Facet: Count & Data)
        Sort sort = pageable.getSort().isSorted() ? pageable.getSort() : Sort.by(Sort.Direction.DESC, "createdAt");
        operations.add(Aggregation.sort(sort));

        operations.add(Aggregation.facet()
            .and(Aggregation.skip(pageable.getOffset()), Aggregation.limit(pageable.getPageSize()))
            .as("data")
            .and(Aggregation.count().as("total"))
            .as("metadata")
        );

        // Execute Aggregation
        Aggregation aggregation = Aggregation.newAggregation(operations);
        AggregationResults<Document> results = mongoTemplate.aggregate(aggregation, "jobs", Document.class);
        
        Document resultDoc = results.getUniqueMappedResult();
        if (resultDoc == null) return Page.empty(pageable);

        List<Document> data = (List<Document>) resultDoc.get("data");
        List<Document> metadata = (List<Document>) resultDoc.get("metadata");
        
        long total = metadata.isEmpty() ? 0 : ((Number) metadata.get(0).get("total")).longValue();
        
        // Map Document back to Job Entity
        List<Job> jobs = data.stream()
            .map(doc -> mongoTemplate.getConverter().read(Job.class, doc))
            .toList();

        return new PageImpl<>(jobs, pageable, total);
    }
}
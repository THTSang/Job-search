package com.example.server.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.util.StringUtils;

import com.example.server.model.JobSeekerProfile;

import lombok.RequiredArgsConstructor;

/**
 * Class triển khai logic tìm kiếm nâng cao cho Profile.
 * Spring Data sẽ tự động nhận diện class này nhờ hậu tố "Impl" kết hợp với tên Repository chính.
 */
@RequiredArgsConstructor
public class JobSeekerProfileRepositoryCustomImpl implements JobSeekerProfileRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public Page<JobSeekerProfile> searchProfiles(String keyword, Pageable pageable) {
        Query query = new Query();

        // Mentor Note: Xây dựng Criteria động
        // Nếu có keyword, tìm kiếm trong fullName HOẶC professionalTitle (Case-insensitive)
        if (StringUtils.hasText(keyword)) {
            Criteria criteria = new Criteria().orOperator(
                Criteria.where("fullName").regex(keyword, "i"),
                Criteria.where("professionalTitle").regex(keyword, "i")
            );
            query.addCriteria(criteria);
        }

        // Mentor Note: Đếm tổng số bản ghi thỏa mãn điều kiện (để phân trang)
        long total = mongoTemplate.count(query, JobSeekerProfile.class);

        // Áp dụng phân trang (skip/limit) và sort từ Pageable
        query.with(pageable);

        // Thực thi query lấy danh sách
        List<JobSeekerProfile> profiles = mongoTemplate.find(query, JobSeekerProfile.class);

        // Trả về đối tượng Page chuẩn của Spring Data
        return new PageImpl<>(profiles, pageable, total);
    }
}
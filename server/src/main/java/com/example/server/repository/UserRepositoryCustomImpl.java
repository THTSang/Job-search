package com.example.server.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.util.StringUtils;

import com.example.server.model.User;
import com.example.server.model.UserStatus;

import lombok.RequiredArgsConstructor;

/**
 * Class triển khai logic tìm kiếm nâng cao cho User.
 * Spring Data sẽ tự động nhận diện class này nhờ hậu tố "Impl".
 */
@RequiredArgsConstructor
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public Page<User> searchUsers(String keyword, Pageable pageable) {
        Query query = new Query();

        // Mentor Note: Tìm kiếm theo name hoặc email nếu có keyword
        if (StringUtils.hasText(keyword)) {
            Criteria criteria = new Criteria().orOperator(
                Criteria.where("name").regex(keyword, "i"),
                Criteria.where("email").regex(keyword, "i")
            );
            query.addCriteria(criteria);
        }

        long total = mongoTemplate.count(query, User.class);
        
        query.with(pageable);
        List<User> users = mongoTemplate.find(query, User.class);

        return new PageImpl<>(users, pageable, total);
    }

    @Override
    public User updateStatus(String id, UserStatus status) {
        Query query = new Query(Criteria.where("id").is(id));
        
        Update update = new Update()
            .set("status", status)
            .set("updatedAt", Instant.now());

        FindAndModifyOptions options = FindAndModifyOptions.options().returnNew(true);

        return mongoTemplate.findAndModify(query, update, options, User.class);
    }
}
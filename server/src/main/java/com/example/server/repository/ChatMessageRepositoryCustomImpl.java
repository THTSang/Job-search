package com.example.server.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import com.example.server.model.ChatMessage;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ChatMessageRepositoryCustomImpl implements ChatMessageRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public Page<ChatMessage> findConversations(String userId, Pageable pageable) {
        Criteria criteria = new Criteria().orOperator(
            Criteria.where("senderId").is(userId),
            Criteria.where("recipientId").is(userId)
        );

        // 1. Calculate Total Count (Count distinct chatIds)
        Aggregation countAggregation = Aggregation.newAggregation(
            Aggregation.match(criteria),
            Aggregation.group("chatId"),
            Aggregation.count().as("total")
        );
        
        AggregationResults<CountResult> countResults = mongoTemplate.aggregate(
            countAggregation, ChatMessage.class, CountResult.class
        );
        
        long total = countResults.getUniqueMappedResult() != null ? countResults.getUniqueMappedResult().total : 0;

        // 2. Fetch Data
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.match(criteria),
            Aggregation.sort(Sort.Direction.DESC, "createdAt"), // Sort messages to get latest first
            Aggregation.group("chatId").first("$$ROOT").as("latestMessage"),
            Aggregation.replaceRoot("latestMessage"),
            Aggregation.sort(Sort.Direction.DESC, "createdAt"), // Sort conversations by latest message
            Aggregation.skip(pageable.getOffset()),
            Aggregation.limit(pageable.getPageSize())
        );

        List<ChatMessage> results = mongoTemplate.aggregate(
            aggregation, ChatMessage.class, ChatMessage.class
        ).getMappedResults();

        return new PageImpl<>(results, pageable, total);
    }

    // Helper class for mapping count result
    private static class CountResult {
        public long total;
    }
}
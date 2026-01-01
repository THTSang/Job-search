package com.example.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Category;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
}
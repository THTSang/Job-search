package com.example.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Company;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {
}
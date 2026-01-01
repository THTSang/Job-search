package com.example.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Location;

@Repository
public interface LocationRepository extends MongoRepository<Location, String> {
}
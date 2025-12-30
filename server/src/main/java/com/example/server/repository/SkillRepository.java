package com.example.server.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.server.model.Skill;

@Repository
public interface SkillRepository extends MongoRepository<Skill, String> {
    Optional<Skill> findByName(String name);
    boolean existsByName(String name);
}
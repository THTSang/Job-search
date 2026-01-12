package com.example.server.service;

import com.example.server.dto.GeneralDtos.SystemStatsResponse;
import com.example.server.repository.CompanyRepository;
import com.example.server.repository.JobRepository;
import com.example.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeneralServiceImpl implements GeneralService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    @Override
    public SystemStatsResponse getSystemStats() {
        // Sử dụng method count() có sẵn của MongoRepository
        var userCount = userRepository.count();
        var jobCount = jobRepository.count();
        var companyCount = companyRepository.count();

        return new SystemStatsResponse(userCount, jobCount, companyCount);
    }
}
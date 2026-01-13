package com.example.server.service;

import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.server.dto.CompanyDtos.CompanyResponse;
import com.example.server.dto.CompanyDtos.CreateCompanyRequest;
import com.example.server.dto.CompanyDtos.UpdateCompanyRequest;
import com.example.server.exception.NotFoundException;
import com.example.server.model.Company;
import com.example.server.repository.CompanyRepository;
import com.example.server.repository.JobRepository;
import org.springframework.util.StringUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    @Override
    public CompanyResponse createCompany(String recruiterId, CreateCompanyRequest request) {
        // 1. Kiểm tra xem Recruiter này đã tạo công ty chưa (Rule: Single Company per Recruiter)
        // Tham khảo business-rules.md: Mỗi Recruiter chỉ được phép tạo và quản lý tối đa một hồ sơ công ty.
        if (companyRepository.findByRecruiterId(recruiterId).isPresent()) {
            throw new IllegalArgumentException("Recruiter already has a company profile.");
        }

        // 2. Kiểm tra tên công ty đã tồn tại chưa (Rule: Unique Name)
        // Tránh việc tạo trùng lặp gây nhầm lẫn trong hệ thống.
        if (companyRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Company name already exists: " + request.name());
        }

        // 3. Map DTO sang Entity sử dụng Builder Pattern
        // Gán recruiterId từ tham số truyền vào (lấy từ Token ở Controller)
        Company company = Company.builder()
                .name(request.name())
                .industry(request.industry())
                .scale(request.scale())
                .address(request.address())
                .logoUrl(request.logoUrl())
                .contactEmail(request.contactEmail())
                .phone(request.phone())
                .website(request.website())
                .description(request.description())
                .recruiterId(recruiterId) // Gán chủ sở hữu
                .isVerified(false) // Mặc định chưa xác thực
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        // 4. Lưu vào Database
        Company savedCompany = companyRepository.save(company);

        // 5. Map Entity đã lưu sang Response DTO để trả về
        return toResponse(savedCompany);
    }

    @Override
    public Page<CompanyResponse> getAllCompanies(Pageable pageable) {
        return companyRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Override
    public CompanyResponse getCompanyById(String id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Company not found with id: " + id));
        return toResponse(company);
    }

    @Override
    public CompanyResponse getCompanyByRecruiterId(String recruiterId) {
        Company company = companyRepository.findByRecruiterId(recruiterId)
                .orElseThrow(() -> new NotFoundException("Recruiter does not have a company profile yet."));
        return toResponse(company);
    }

    @Override
    public CompanyResponse updateCompany(String recruiterId, String companyId, UpdateCompanyRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new NotFoundException("Company not found"));

        // Kiểm tra quyền sở hữu: Chỉ Recruiter tạo ra công ty mới được sửa
        if (!company.getRecruiterId().equals(recruiterId)) {
            throw new IllegalArgumentException("You are not authorized to update this company.");
        }

        // Partial Update: Chỉ cập nhật các trường có dữ liệu
        if (StringUtils.hasText(request.name())) company.setName(request.name());
        if (StringUtils.hasText(request.industry())) company.setIndustry(request.industry());
        if (StringUtils.hasText(request.scale())) company.setScale(request.scale());
        if (StringUtils.hasText(request.address())) company.setAddress(request.address());
        if (StringUtils.hasText(request.logoUrl())) company.setLogoUrl(request.logoUrl());
        if (StringUtils.hasText(request.contactEmail())) company.setContactEmail(request.contactEmail());
        if (StringUtils.hasText(request.phone())) company.setPhone(request.phone());
        if (StringUtils.hasText(request.website())) company.setWebsite(request.website());
        if (StringUtils.hasText(request.description())) company.setDescription(request.description());

        // Cập nhật thời gian sửa đổi
        company.setUpdatedAt(Instant.now());

        Company updatedCompany = companyRepository.save(company);
        return toResponse(updatedCompany);
    }

    @Override
    public void deleteCompany(String id, String requesterId, boolean isAdmin) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Company not found"));

        // 1. Check Permission: Nếu không phải Admin thì phải là Owner
        if (!isAdmin && !company.getRecruiterId().equals(requesterId)) {
            throw new IllegalArgumentException("You are not authorized to delete this company.");
        }

        // 2. Check Data Integrity (Phương án A): Chặn nếu còn Job
        if (jobRepository.existsByCompanyId(id)) {
            throw new IllegalArgumentException("Cannot delete company. Please delete all associated jobs first.");
        }

        // 3. Delete
        companyRepository.deleteById(id);
    }

    /**
     * Helper method để chuyển đổi từ Entity sang CompanyResponse DTO.
     * Việc này giúp code trong hàm chính gọn gàng hơn.
     */
    private CompanyResponse toResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getIndustry(),
                company.getScale(),
                company.getAddress(),
                company.getLogoUrl(),
                company.getContactEmail(),
                company.getPhone(),
                company.getWebsite(),
                company.getDescription(),
                company.getRecruiterId(),
                company.getIsVerified(),
                company.getCreatedAt(),
                company.getUpdatedAt()
        );
    }
}
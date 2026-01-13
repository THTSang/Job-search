package com.example.server.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.server.dto.CompanyDtos.CompanyResponse;
import com.example.server.dto.CompanyDtos.CreateCompanyRequest;
import com.example.server.dto.CompanyDtos.UpdateCompanyRequest;

public interface CompanyService {
    // Tạo mới công ty cho Recruiter
    CompanyResponse createCompany(String recruiterId, CreateCompanyRequest request);

    // Lấy danh sách toàn bộ công ty (có phân trang)
    Page<CompanyResponse> getAllCompanies(Pageable pageable);

    // Lấy thông tin công ty theo ID
    CompanyResponse getCompanyById(String id);

    // Lấy thông tin công ty của Recruiter đang đăng nhập
    CompanyResponse getCompanyByRecruiterId(String recruiterId);

    // Cập nhật thông tin công ty (kiểm tra quyền sở hữu)
    CompanyResponse updateCompany(String recruiterId, String companyId, UpdateCompanyRequest request);

    // Xóa công ty (Admin hoặc Owner, chặn nếu còn Job)
    void deleteCompany(String id, String requesterId, boolean isAdmin);
}
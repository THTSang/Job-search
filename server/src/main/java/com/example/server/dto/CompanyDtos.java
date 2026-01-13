package com.example.server.dto;

import java.time.Instant;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CompanyDtos {

    public record CreateCompanyRequest(
            @NotBlank(message = "Tên công ty không được để trống")
            String name,

            @NotBlank(message = "Ngành nghề không được để trống")
            String industry,

            @NotBlank(message = "Quy mô không được để trống")
            String scale,

            @NotBlank(message = "Địa chỉ không được để trống")
            String address,

            String logoUrl,

            @NotBlank(message = "Email liên hệ không được để trống")
            @Email(message = "Email không hợp lệ")
            String contactEmail,

            @NotBlank(message = "Số điện thoại không được để trống")
            @Pattern(regexp = "^\\+?[0-9\\-\\s]{9,15}$", message = "Số điện thoại không hợp lệ")
            String phone,

            String website,

            @NotBlank(message = "Mô tả không được để trống")
            String description
    ) {}

    public record UpdateCompanyRequest(
            String name,
            String industry,
            String scale,
            String address,
            String logoUrl,
            String contactEmail,
            String phone,
            String website,
            String description
    ) {}

    public record VerifyCompanyRequest(
            Boolean isVerified
    ) {}

    public record CompanyResponse(
            String id,
            String name,
            String industry,
            String scale,
            String address,
            String logoUrl,
            String contactEmail,
            String phone,
            String website,
            String description,
            String recruiterId,
            Boolean isVerified,
            Instant createdAt,
            Instant updatedAt
    ) {}
}
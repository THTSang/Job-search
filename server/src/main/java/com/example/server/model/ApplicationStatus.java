package com.example.server.model;

public enum ApplicationStatus {
    PENDING,        // Đang chờ xử lý
    INTERVIEWING,   // Đang phỏng vấn
    OFFERED,        // Đã nhận offer
    REJECTED,       // Bị từ chối
    CANCELLED       // Ứng viên hủy đơn
}
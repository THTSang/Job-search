package com.example.server.service;

import com.example.server.dto.GeneralDtos.SystemStatsResponse;

public interface GeneralService {
    SystemStatsResponse getSystemStats();
}
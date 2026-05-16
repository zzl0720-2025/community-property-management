package com.community.management.dto.maintenance;

import com.community.management.entity.MaintenanceRequest.RequestStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MaintenanceResponse {

    private Long id;
    private String title;
    private String description;
    private String location;
    private RequestStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime resolvedAt;
    private Long submittedById;
    private String submittedByName;
}

package com.community.management.dto.maintenance;

import com.community.management.entity.MaintenanceRequest.RequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/** Request body for PATCH /api/maintenance/{id}/status */
@Data
public class MaintenanceStatusUpdateRequest {

    @NotNull
    private RequestStatus status;
}

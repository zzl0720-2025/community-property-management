package com.community.management.service;

import com.community.management.entity.MaintenanceRequest;
import java.util.List;

public interface MaintenanceService {

    List<MaintenanceRequest> getAll();

    List<MaintenanceRequest> getByUser(Long userId);

    MaintenanceRequest create(MaintenanceRequest request);

    MaintenanceRequest updateStatus(Long id, MaintenanceRequest.RequestStatus status);
}

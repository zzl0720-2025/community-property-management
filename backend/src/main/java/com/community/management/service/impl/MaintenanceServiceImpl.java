package com.community.management.service.impl;

import com.community.management.entity.MaintenanceRequest;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.repository.MaintenanceRequestRepository;
import com.community.management.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRequestRepository maintenanceRepository;

    @Override
    public List<MaintenanceRequest> getAll() {
        return maintenanceRepository.findAll();
    }

    @Override
    public List<MaintenanceRequest> getByUser(Long userId) {
        return maintenanceRepository.findBySubmittedByIdOrderBySubmittedAtDesc(userId);
    }

    @Override
    public MaintenanceRequest create(MaintenanceRequest request) {
        // TODO: set submittedBy from security context
        return maintenanceRepository.save(request);
    }

    @Override
    public MaintenanceRequest updateStatus(Long id, MaintenanceRequest.RequestStatus status) {
        MaintenanceRequest req = maintenanceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + id));
        req.setStatus(status);
        if (status == MaintenanceRequest.RequestStatus.RESOLVED) {
            req.setResolvedAt(LocalDateTime.now());
        }
        return maintenanceRepository.save(req);
    }
}

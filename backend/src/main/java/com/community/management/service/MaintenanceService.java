package com.community.management.service;

import com.community.management.dto.maintenance.MaintenanceCreateRequest;
import com.community.management.dto.maintenance.MaintenanceResponse;
import com.community.management.entity.MaintenanceRequest;
import com.community.management.entity.MaintenanceRequest.RequestStatus;
import com.community.management.entity.User;
import com.community.management.exception.InvalidMaintenanceRequestException;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.repository.MaintenanceRequestRepository;
import com.community.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceRequestRepository maintenanceRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<MaintenanceResponse> getAll(Pageable pageable) {
        return maintenanceRepository.findAll(pageable).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MaintenanceResponse> getByUser(Long userId, Pageable pageable) {
        return maintenanceRepository.findBySubmittedByIdOrderBySubmittedAtDesc(userId, pageable).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MaintenanceResponse create(MaintenanceCreateRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        MaintenanceRequest entity = new MaintenanceRequest();
        entity.setTitle(request.getTitle());
        entity.setDescription(request.getDescription());
        entity.setLocation(request.getLocation());
        entity.setSubmittedBy(user);
        entity.setStatus(RequestStatus.OPEN);

        return toResponse(maintenanceRepository.save(entity));
    }

    @Transactional
    public MaintenanceResponse updateStatus(Long id, RequestStatus newStatus) {
        MaintenanceRequest req = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance request not found: " + id));

        validateTransition(req.getStatus(), newStatus);

        req.setStatus(newStatus);
        if (newStatus == RequestStatus.RESOLVED) {
            req.setResolvedAt(LocalDateTime.now());
        }

        return toResponse(maintenanceRepository.save(req));
    }

    private void validateTransition(RequestStatus current, RequestStatus next) {
        if (current == RequestStatus.CLOSED) {
            throw new InvalidMaintenanceRequestException("Cannot change the status of a closed request");
        }
        if (next == RequestStatus.OPEN) {
            throw new InvalidMaintenanceRequestException("Cannot reopen a maintenance request");
        }
    }

    private MaintenanceResponse toResponse(MaintenanceRequest req) {
        MaintenanceResponse response = new MaintenanceResponse();
        response.setId(req.getId());
        response.setTitle(req.getTitle());
        response.setDescription(req.getDescription());
        response.setLocation(req.getLocation());
        response.setStatus(req.getStatus());
        response.setSubmittedAt(req.getSubmittedAt());
        response.setResolvedAt(req.getResolvedAt());
        response.setSubmittedById(req.getSubmittedBy().getId());
        response.setSubmittedByName(req.getSubmittedBy().getFullName());
        return response;
    }
}

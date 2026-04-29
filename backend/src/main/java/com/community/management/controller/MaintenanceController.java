package com.community.management.controller;

import com.community.management.entity.MaintenanceRequest;
import com.community.management.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * MaintenanceController — repair and issue ticket management.
 *
 * GET    /api/maintenance             → all requests (ADMIN/STAFF)
 * GET    /api/maintenance/user/{id}   → requests by user
 * POST   /api/maintenance             → submit new request
 * PATCH  /api/maintenance/{id}/status → update status (ADMIN/STAFF)
 */
@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<MaintenanceRequest>> getAll() {
        return ResponseEntity.ok(maintenanceService.getAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MaintenanceRequest>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(maintenanceService.getByUser(userId));
    }

    @PostMapping
    public ResponseEntity<MaintenanceRequest> create(@RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(maintenanceService.create(request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<MaintenanceRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam MaintenanceRequest.RequestStatus status) {
        return ResponseEntity.ok(maintenanceService.updateStatus(id, status));
    }
}

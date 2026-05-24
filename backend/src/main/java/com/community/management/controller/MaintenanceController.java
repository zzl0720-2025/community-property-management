package com.community.management.controller;

import com.community.management.dto.maintenance.MaintenanceCreateRequest;
import com.community.management.dto.maintenance.MaintenanceResponse;
import com.community.management.dto.maintenance.MaintenanceStatusUpdateRequest;
import com.community.management.entity.User;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.exception.UnauthorizedActionException;
import com.community.management.repository.UserRepository;
import com.community.management.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<MaintenanceResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        int safeSize = Math.min(size, 100);
        return ResponseEntity.ok(maintenanceService.getAll(PageRequest.of(page, safeSize)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MaintenanceResponse>> getByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !resolveUserId(userDetails).equals(userId)) {
            throw new UnauthorizedActionException("You are not authorized to view these requests");
        }
        int safeSize = Math.min(size, 100);
        return ResponseEntity.ok(maintenanceService.getByUser(userId, PageRequest.of(page, safeSize)));
    }

    @PostMapping
    public ResponseEntity<MaintenanceResponse> create(
            @Valid @RequestBody MaintenanceCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = resolveUserId(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(maintenanceService.create(request, userId));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<MaintenanceResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceStatusUpdateRequest request) {
        return ResponseEntity.ok(maintenanceService.updateStatus(id, request.getStatus()));
    }

    private Long resolveUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userDetails.getUsername()));
    }
}

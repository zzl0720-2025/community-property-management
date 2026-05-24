package com.community.management.controller;

import com.community.management.entity.Announcement;
import com.community.management.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AnnouncementController — dashboard announcement feed.
 *
 * GET    /api/announcements        → all announcements (authenticated)
 * POST   /api/announcements        → create (ADMIN only)
 * DELETE /api/announcements/{id}   → delete (ADMIN only)
 */
@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @GetMapping
    public ResponseEntity<List<Announcement>> getAll() {
        return ResponseEntity.ok(announcementService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Announcement> create(
            @RequestBody Announcement announcement,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(announcementService.create(announcement, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        announcementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

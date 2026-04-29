package com.community.management.controller;

import com.community.management.entity.Booking;
import com.community.management.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * BookingController — facility/room reservation management.
 *
 * GET    /api/bookings             → all bookings (ADMIN)
 * GET    /api/bookings/user/{id}   → bookings by user
 * POST   /api/bookings             → create booking
 * PATCH  /api/bookings/{id}/status → approve/reject (ADMIN)
 * DELETE /api/bookings/{id}        → cancel booking
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAll() {
        return ResponseEntity.ok(bookingService.getAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getByUser(userId));
    }

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.create(booking));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> updateStatus(@PathVariable Long id,
                                                @RequestParam Booking.BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        bookingService.cancel(id);
        return ResponseEntity.noContent().build();
    }
}

package com.community.management.controller;

import com.community.management.dto.PaymentCreateRequest;
import com.community.management.entity.Payment;
import com.community.management.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * PaymentController — mock payment management.
 * No real payment gateway — markAsPaid() simulates a successful transaction.
 *
 * GET    /api/payments/user/{id}  → payment history for user
 * POST   /api/payments            → create a payment record (ADMIN)
 * PATCH  /api/payments/{id}/pay   → mock: mark as paid
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getByUser(userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Payment> create(@Valid @RequestBody PaymentCreateRequest request) {
        return ResponseEntity.ok(paymentService.create(request));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<Payment> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.markAsPaid(id));
    }
}

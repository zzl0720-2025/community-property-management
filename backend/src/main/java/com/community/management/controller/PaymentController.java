package com.community.management.controller;

import com.community.management.entity.Payment;
import com.community.management.service.PaymentService;
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
 * POST   /api/payments            → create a payment record
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
    public ResponseEntity<Payment> create(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.create(payment));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<Payment> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.markAsPaid(id));
    }
}

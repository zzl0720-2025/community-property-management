package com.community.management.service.impl;

import com.community.management.entity.Payment;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.repository.PaymentRepository;
import com.community.management.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Mock payment service — no real gateway.
 * markAsPaid() immediately flips the status to PAID.
 */
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    public List<Payment> getByUser(Long userId) {
        return paymentRepository.findByPaidByIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Payment create(Payment payment) {
        // TODO: set paidBy from security context
        return paymentRepository.save(payment);
    }

    @Override
    public Payment markAsPaid(Long id) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id));
        payment.setStatus(Payment.PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }
}

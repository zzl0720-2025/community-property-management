package com.community.management.service;

import com.community.management.entity.Payment;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public List<Payment> getByUser(Long userId) {
        return paymentRepository.findByPaidByIdOrderByCreatedAtDesc(userId);
    }

    public Payment create(Payment payment) {
        // TODO: set paidBy from security context
        return paymentRepository.save(payment);
    }

    public Payment markAsPaid(Long id) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id));
        payment.setStatus(Payment.PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }
}

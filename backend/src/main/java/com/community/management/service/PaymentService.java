package com.community.management.service;

import com.community.management.dto.PaymentCreateRequest;
import com.community.management.entity.Payment;
import com.community.management.entity.Payment.PaymentStatus;
import com.community.management.entity.User;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.repository.PaymentRepository;
import com.community.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public List<Payment> getByUser(Long userId) {
        return paymentRepository.findByPaidByIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Admin creates a payment record for a specific resident.
     * Maps the DTO's "unpaid"/"paid" status strings to the PaymentStatus enum.
     */
    public Payment create(PaymentCreateRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.getUserId()));

        Payment payment = new Payment();
        payment.setPaidBy(user);
        payment.setDescription(req.getType());
        payment.setAmount(req.getAmount());

        // Map frontend-friendly status labels to enum
        if ("paid".equalsIgnoreCase(req.getStatus())) {
            payment.setStatus(PaymentStatus.PAID);
            payment.setPaidAt(LocalDateTime.now());
        } else {
            payment.setStatus(PaymentStatus.PENDING);
        }

        return paymentRepository.save(payment);
    }

    public Payment markAsPaid(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id));
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }
}

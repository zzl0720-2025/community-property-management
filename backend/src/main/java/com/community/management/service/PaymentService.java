package com.community.management.service;

import com.community.management.entity.Payment;
import java.util.List;

public interface PaymentService {

    List<Payment> getByUser(Long userId);

    Payment create(Payment payment);

    /** Mock: immediately marks a payment as PAID. */
    Payment markAsPaid(Long id);
}

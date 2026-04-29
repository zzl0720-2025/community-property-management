package com.community.management.repository;

import com.community.management.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByPaidByIdOrderByCreatedAtDesc(Long userId);
}

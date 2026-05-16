package com.community.management.repository;

import com.community.management.entity.MaintenanceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

    Page<MaintenanceRequest> findBySubmittedByIdOrderBySubmittedAtDesc(Long userId, Pageable pageable);
}

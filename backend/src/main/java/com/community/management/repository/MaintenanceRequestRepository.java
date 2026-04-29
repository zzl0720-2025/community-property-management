package com.community.management.repository;

import com.community.management.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {

    List<MaintenanceRequest> findBySubmittedByIdOrderBySubmittedAtDesc(Long userId);
}

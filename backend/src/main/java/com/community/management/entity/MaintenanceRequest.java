package com.community.management.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * MaintenanceRequest entity — a repair/issue ticket submitted by a resident.
 */
@Data
@Entity
@Table(name = "maintenance_requests")
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String location;       // e.g. "Unit 4B", "Lobby"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.OPEN;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    private LocalDateTime resolvedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "submitted_by", nullable = false)
    private User submittedBy;

    public enum RequestStatus {
        OPEN, IN_PROGRESS, RESOLVED, CLOSED
    }
}

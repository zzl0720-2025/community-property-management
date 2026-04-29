package com.community.management.entity;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Role entity — defines access levels (e.g. ADMIN, RESIDENT, STAFF).
 * Many-to-many with User.
 */
@Data
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String name;           // e.g. "ROLE_ADMIN", "ROLE_RESIDENT"
}

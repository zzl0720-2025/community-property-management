package com.community.management.repository;

import com.community.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/** Spring Data JPA repository for User — no implementation needed. */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}

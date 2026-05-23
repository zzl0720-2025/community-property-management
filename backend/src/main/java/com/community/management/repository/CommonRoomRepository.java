package com.community.management.repository;

import com.community.management.entity.CommonRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommonRoomRepository extends JpaRepository<CommonRoom, Long> {
    Optional<CommonRoom> findByName(String name);
}

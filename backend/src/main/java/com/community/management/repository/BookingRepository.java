package com.community.management.repository;

import com.community.management.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByBookedByIdOrderByStartTimeDesc(Long userId);
}

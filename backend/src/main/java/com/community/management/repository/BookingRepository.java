package com.community.management.repository;

import com.community.management.entity.Booking;
import com.community.management.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.status NOT IN :excludedStatuses " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    List<Booking> findConflicts(@Param("roomId") Long roomId,
                                @Param("startTime") LocalDateTime startTime,
                                @Param("endTime") LocalDateTime endTime,
                                @Param("excludedStatuses") List<BookingStatus> excludedStatuses);
}

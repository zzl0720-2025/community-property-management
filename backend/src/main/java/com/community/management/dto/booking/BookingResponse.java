package com.community.management.dto.booking;

import com.community.management.entity.BookingStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingResponse {

    private Long id;
    private Long roomId;
    private String roomName;
    private Long userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BookingStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Frontend-facing display fields
    private String facility;   // same as roomName
    private String date;       // YYYY-MM-DD from startTime
    private String time;       // HH:mm-HH:mm from startTime/endTime
    private String user;       // full name of the booking user
}

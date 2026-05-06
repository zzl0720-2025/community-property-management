package com.community.management.dto.booking;

import com.community.management.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingStatusUpdateRequest {

    @NotNull
    private BookingStatus status;
}

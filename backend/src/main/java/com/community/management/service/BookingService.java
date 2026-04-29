package com.community.management.service;

import com.community.management.entity.Booking;
import java.util.List;

public interface BookingService {

    List<Booking> getAll();

    List<Booking> getByUser(Long userId);

    Booking create(Booking booking);

    Booking updateStatus(Long id, Booking.BookingStatus status);

    void cancel(Long id);
}

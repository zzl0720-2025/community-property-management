package com.community.management.service;

import com.community.management.entity.Booking;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public List<Booking> getAll() {
        return bookingRepository.findAll();
    }

    public List<Booking> getByUser(Long userId) {
        return bookingRepository.findByBookedByIdOrderByStartTimeDesc(userId);
    }

    public Booking create(Booking booking) {
        // TODO: check for time conflicts, set bookedBy from security context
        return bookingRepository.save(booking);
    }

    public Booking updateStatus(Long id, Booking.BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + id));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public void cancel(Long id) {
        updateStatus(id, Booking.BookingStatus.CANCELLED);
    }
}

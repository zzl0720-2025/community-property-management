package com.community.management.service;

import com.community.management.dto.booking.BookingRequest;
import com.community.management.dto.booking.BookingResponse;
import com.community.management.entity.Booking;
import com.community.management.entity.BookingStatus;
import com.community.management.entity.CommonRoom;
import com.community.management.entity.User;
import com.community.management.exception.BookingConflictException;
import com.community.management.exception.InvalidBookingException;
import com.community.management.exception.ResourceNotFoundException;
import com.community.management.exception.UnauthorizedActionException;
import com.community.management.repository.BookingRepository;
import com.community.management.repository.CommonRoomRepository;
import com.community.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * BookingService — handles facility/room booking business logic.
 * Validates time conflicts before creating bookings.
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CommonRoomRepository commonRoomRepository;
    private final UserRepository userRepository;

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse createBooking(BookingRequest request, Long userId) {
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new InvalidBookingException("End time must be after start time");
        }

        CommonRoom room = commonRoomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + request.getRoomId()));

        List<Booking> conflicts = bookingRepository.findConflicts(
                request.getRoomId(), request.getStartTime(), request.getEndTime(),
                List.of(BookingStatus.CANCELLED, BookingStatus.REJECTED));
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Room is already booked for the requested time slot");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setNotes(request.getNotes());
        booking.setStatus(BookingStatus.PENDING);

        return toResponse(bookingRepository.save(booking));
    }

    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));
        booking.setStatus(status);
        return toResponse(bookingRepository.save(booking));
    }

    public void cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (userId != null && !booking.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You are not authorized to cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private BookingResponse toResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setRoomId(booking.getRoom().getId());
        response.setRoomName(booking.getRoom().getName());
        response.setUserId(booking.getUser().getId());
        response.setStartTime(booking.getStartTime());
        response.setEndTime(booking.getEndTime());
        response.setStatus(booking.getStatus());
        response.setNotes(booking.getNotes());
        response.setCreatedAt(booking.getCreatedAt());
        response.setUpdatedAt(booking.getUpdatedAt());
        return response;
    }
}

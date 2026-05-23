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
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
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

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId, Pageable pageable) {
        return bookingRepository.findByUserId(userId, pageable).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request, Long userId) {
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new InvalidBookingException("End time must be after start time");
        }

        CommonRoom room = commonRoomRepository.findByName(request.getRoomName())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + request.getRoomName()));

        // Lock the room row so concurrent booking attempts for the same room are
        // serialized: the second request blocks here until the first transaction
        // commits, then sees the newly-saved booking during the conflict check.
        entityManager.lock(room, LockModeType.PESSIMISTIC_WRITE);

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

    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus newStatus) {
        if (newStatus == BookingStatus.CANCELLED || newStatus == BookingStatus.PENDING) {
            throw new InvalidBookingException(
                    "Status can only be set to APPROVED or REJECTED through this endpoint");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        BookingStatus current = booking.getStatus();
        if (current == BookingStatus.CANCELLED) {
            throw new InvalidBookingException("Cannot change the status of a cancelled booking");
        }
        if (current == BookingStatus.REJECTED && newStatus == BookingStatus.APPROVED) {
            throw new InvalidBookingException(
                    "Cannot approve a rejected booking; the resident must create a new booking");
        }

        booking.setStatus(newStatus);
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public void cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (userId != null && !booking.getUser().getId().equals(userId)) {
            throw new UnauthorizedActionException("You are not authorized to cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

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
        // Frontend display fields
        response.setFacility(booking.getRoom().getName());
        response.setDate(booking.getStartTime().toLocalDate().toString());
        response.setTime(booking.getStartTime().format(TIME_FMT) + "-" + booking.getEndTime().format(TIME_FMT));
        response.setUser(booking.getUser().getFullName());
        return response;
    }
}

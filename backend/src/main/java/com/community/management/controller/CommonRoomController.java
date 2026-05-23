package com.community.management.controller;

import com.community.management.dto.booking.CommonRoomResponse;
import com.community.management.repository.CommonRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * CommonRoomController — exposes the list of bookable rooms.
 * GET /api/rooms → used by the frontend to populate the facility picker.
 */
@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class CommonRoomController {

    private final CommonRoomRepository commonRoomRepository;

    @GetMapping
    public ResponseEntity<List<CommonRoomResponse>> getAll() {
        List<CommonRoomResponse> rooms = commonRoomRepository.findAll().stream()
                .map(r -> new CommonRoomResponse(r.getId(), r.getName(), r.getDescription(), r.getCapacity()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(rooms);
    }
}

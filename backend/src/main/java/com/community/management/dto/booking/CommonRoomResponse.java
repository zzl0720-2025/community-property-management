package com.community.management.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommonRoomResponse {
    private Long id;
    private String name;
    private String description;
    private Integer capacity;
}

package com.community.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Generic wrapper for simple success/error messages.
 * Usage: return ResponseEntity.ok(new ApiResponse(true, "Done"));
 */
@Data
@AllArgsConstructor
public class ApiResponse {

    private boolean success;
    private String message;
}

package com.community.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/** Response body returned after successful login or register. */
@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;       // JWT bearer token
    private String email;
    private String fullName;
}

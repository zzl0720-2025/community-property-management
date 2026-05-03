package com.community.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

/** Response body returned after successful login or register. */
@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;           // JWT bearer token (null for /me endpoint)
    private Long id;
    private String email;
    private String fullName;
    private List<String> roles;
}

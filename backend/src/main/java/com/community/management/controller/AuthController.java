package com.community.management.controller;

import com.community.management.dto.AuthResponse;
import com.community.management.dto.LoginRequest;
import com.community.management.dto.RegisterRequest;
import com.community.management.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController — public endpoints for login and registration.
 * No JWT required (permitted in SecurityConfig).
 *
 * POST /api/auth/login    → returns JWT token
 * POST /api/auth/register → creates account, returns JWT token
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
}

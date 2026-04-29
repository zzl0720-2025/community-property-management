package com.community.management.service;

import com.community.management.dto.AuthResponse;
import com.community.management.dto.LoginRequest;
import com.community.management.dto.RegisterRequest;

/**
 * AuthService — contract for authentication operations.
 * Implementation lives in impl/AuthServiceImpl.java.
 */
public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);
}

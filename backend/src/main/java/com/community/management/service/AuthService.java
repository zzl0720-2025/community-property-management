package com.community.management.service;

import com.community.management.dto.AuthResponse;
import com.community.management.dto.LoginRequest;
import com.community.management.dto.RegisterRequest;
import com.community.management.entity.Role;
import com.community.management.entity.User;
import com.community.management.repository.RoleRepository;
import com.community.management.repository.UserRepository;
import com.community.management.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        return buildResponse(jwtUtil.generateToken(user.getEmail()), user);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        Role residentRole = roleRepository.findByName("ROLE_RESIDENT")
            .orElseThrow(() -> new RuntimeException("Default role not found"));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Set.of(residentRole));
        userRepository.save(user);

        return buildResponse(jwtUtil.generateToken(user.getEmail()), user);
    }

    public AuthResponse getMe(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return buildResponse(null, user);
    }

    private AuthResponse buildResponse(String token, User user) {
        List<String> roles = user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toList());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), roles);
    }
}

package com.community.management.config;

import com.community.management.entity.CommonRoom;
import com.community.management.entity.Role;
import com.community.management.entity.User;
import com.community.management.repository.CommonRoomRepository;
import com.community.management.repository.RoleRepository;
import com.community.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * DataInitializer — runs on startup to seed the roles table and a default admin account.
 * Idempotent: checks existence before inserting.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CommonRoomRepository commonRoomRepository;

    @Override
    public void run(String... args) {
        seedRole("ROLE_ADMIN");
        seedRole("ROLE_RESIDENT");
        seedRole("ROLE_STAFF");

        seedRooms();

        if (!userRepository.existsByEmail("admin@community.com")) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            User admin = new User();
            admin.setEmail("admin@community.com");
            admin.setFullName("System Admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
            log.info("Default admin created — email: admin@community.com, password: admin123");
        }
    }

    private void seedRole(String name) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role();
            role.setName(name);
            roleRepository.save(role);
        }
    }

    private void seedRooms() {
        if (commonRoomRepository.count() == 0) {
            saveRoom("Community Hall", "Large hall for community events and gatherings", 100);
            saveRoom("Meeting Room A", "Small meeting room for residents and committees", 20);
            saveRoom("Gym", "Fitness room with exercise equipment", 15);
            log.info("Sample common rooms seeded");
        }
    }

    private void saveRoom(String name, String description, int capacity) {
        CommonRoom room = new CommonRoom();
        room.setName(name);
        room.setDescription(description);
        room.setCapacity(capacity);
        commonRoomRepository.save(room);
    }
}

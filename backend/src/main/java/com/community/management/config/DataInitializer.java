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
            saveRoom("多功能厅", "大型社区活动厅，适合聚会和集体活动", 100);
            saveRoom("健身房", "配备健身器材的运动室", 15);
            saveRoom("会议室", "供居民和委员会使用的小型会议室", 20);
            saveRoom("棋牌室", "供居民休闲娱乐的棋牌活动室", 12);
            saveRoom("儿童乐园", "儿童游乐区域", 30);
            log.info("Common rooms seeded");
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
